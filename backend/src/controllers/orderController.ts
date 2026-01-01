import type { Request, Response } from "express";
import { z } from "zod";

import { prisma } from "../app";

const parseIntId = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

type RoleName = "BUYER" | "SUPPLIER" | "ADMIN";

const getUserContext = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: { select: { name: true } },
      supplierProfile: { select: { id: true } },
    },
  });

  if (!user) return null;

  return {
    userId: user.id,
    role: (user.role?.name ? String(user.role.name).toUpperCase() : null) as RoleName | string | null,
    supplierProfileId: user.supplierProfile?.id ?? null,
  };
};

const isAdmin = (role: string | null) => role === "ADMIN";
const isBuyer = (role: string | null) => role === "BUYER";
const isSupplier = (role: string | null) => role === "SUPPLIER";

const allowedSupplierTransitions = new Map<string, Set<string>>([
  ["PENDING", new Set(["IN_PROGRESS"])],
  ["CONFIRMED", new Set(["IN_PROGRESS"])],
  ["IN_PROGRESS", new Set(["COMPLETED"])],
]);

const validateSupplierStatusTransition = (from: string, to: string) => {
  const allowed = allowedSupplierTransitions.get(from);
  return Boolean(allowed?.has(to));
};

const createOrderCreatedNotifications = async (order: { id: number; buyerId: number; supplierId: number }) => {
  const supplier = await prisma.supplierProfile.findUnique({
    where: { id: order.supplierId },
    select: { userId: true, companyName: true },
  });

  const notifications: Array<{ userId: number; orderId: number; type: string; message: string }> = [];

  notifications.push({
    userId: order.buyerId,
    orderId: order.id,
    type: "ORDER_CREATED",
    message: `Order #${order.id} created successfully.`,
  });

  if (supplier?.userId) {
    notifications.push({
      userId: supplier.userId,
      orderId: order.id,
      type: "ORDER_CREATED",
      message: `New order #${order.id} received${supplier.companyName ? ` for ${supplier.companyName}` : ""}.`,
    });
  }

  if (notifications.length) {
    await prisma.notification.createMany({ data: notifications });
  }
};

const createOrderStatusNotifications = async (order: {
  id: number;
  buyerId: number;
  supplierId: number;
  status: string;
}) => {
  const supplier = await prisma.supplierProfile.findUnique({
    where: { id: order.supplierId },
    select: { userId: true },
  });

  const notifications: Array<{ userId: number; orderId: number; type: string; message: string }> = [];

  notifications.push({
    userId: order.buyerId,
    orderId: order.id,
    type: "ORDER_STATUS_UPDATED",
    message: `Order #${order.id} status updated to ${order.status}.`,
  });

  if (supplier?.userId) {
    notifications.push({
      userId: supplier.userId,
      orderId: order.id,
      type: "ORDER_STATUS_UPDATED",
      message: `Order #${order.id} status updated to ${order.status}.`,
    });
  }

  if (notifications.length) {
    await prisma.notification.createMany({ data: notifications });
  }
};

type CreateOrderBody = {
  quoteId: number;
};

const CreateOrderSchema = z.object({
  quoteId: z.preprocess(
    (v) => (typeof v === "string" || typeof v === "number" ? Number(v) : v),
    z.number().int().positive()
  ),
});

export const createOrder = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const ctx = await getUserContext(authUserId);
  if (!ctx) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const parsed = CreateOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    console.info("orders.create.validation", { userId: authUserId, issues: parsed.error.issues });
    res.status(400).json({ status: "error", message: "invalid_body" });
    return;
  }

  const quoteId = parsed.data.quoteId;

  if (!(isBuyer(ctx.role) || isAdmin(ctx.role))) {
    console.info("orders.create.forbidden", { userId: authUserId, role: ctx.role });
    res.status(403).json({ status: "error", message: "Forbidden" });
    return;
  }

  try {
    const quote = await prisma.quote.findUnique({
      where: { id: quoteId },
      include: { rfq: true },
    });

    if (!quote) {
      res.status(404).json({ status: "error", message: "quote_not_found" });
      return;
    }

    if (isBuyer(ctx.role) && quote.rfq.buyerId !== authUserId) {
      console.info("orders.create.forbidden", {
        userId: authUserId,
        role: ctx.role,
        quoteId,
        reason: "quote_not_owned_by_buyer",
      });
      res.status(403).json({ status: "error", message: "Forbidden" });
      return;
    }

    const order = await prisma.order.create({
      data: {
        buyerId: quote.rfq.buyerId,
        supplierId: quote.supplierId,
        quoteId: quote.id,
        totalAmount: String(quote.totalPrice),
        currency: quote.currency,
        status: "PENDING",
      },
      include: {
        quote: true,
        supplier: true,
        buyer: { select: { id: true, userEmail: true, firstName: true, lastName: true } },
      },
    });

    console.info("orders.create.success", {
      userId: authUserId,
      role: ctx.role,
      orderId: order.id,
      quoteId,
    });

    await createOrderCreatedNotifications({
      id: order.id,
      buyerId: order.buyerId,
      supplierId: order.supplierId,
    });

    res.status(201).json({ status: "ok", order });
  } catch (error) {
    console.error("orders.create.error", error);
    res.status(500).json({ status: "error", message: "failed_to_create_order" });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const ctx = await getUserContext(authUserId);
  if (!ctx) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        quote: { include: { items: true, rfq: { include: { items: true } } } },
        supplier: true,
        buyer: { select: { id: true, userEmail: true, firstName: true, lastName: true } },
      },
    });

    if (!order) {
      res.status(404).json({ status: "error", message: "order_not_found" });
      return;
    }

    const allowed =
      isAdmin(ctx.role) ||
      (isBuyer(ctx.role) && order.buyerId === authUserId) ||
      (isSupplier(ctx.role) && ctx.supplierProfileId && order.supplierId === ctx.supplierProfileId);

    if (!allowed) {
      console.info("orders.get.forbidden", { userId: authUserId, role: ctx.role, orderId: id });
      res.status(403).json({ status: "error", message: "Forbidden" });
      return;
    }

    res.status(200).json({ status: "ok", order });
  } catch (error) {
    console.error("orders.get.error", error);
    res.status(500).json({ status: "error", message: "failed_to_get_order" });
  }
};

type UpdateOrderBody = {
  status?: string;
  totalAmount?: string | number;
  currency?: string;
};

const OrderStatusSchema = z.enum(["PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]);

const SupplierUpdateOrderSchema = z.object({
  status: OrderStatusSchema,
});

const AdminUpdateOrderSchema = z
  .object({
    status: OrderStatusSchema.optional(),
    totalAmount: z
      .preprocess((v) => (typeof v === "string" || typeof v === "number" ? Number(v) : v), z.number().finite())
      .optional(),
    currency: z.string().min(1).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "no_fields_to_update" });

export const updateOrder = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const ctx = await getUserContext(authUserId);
  if (!ctx) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  const body = req.body as Partial<UpdateOrderBody>;

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ status: "error", message: "order_not_found" });
      return;
    }

    // RBAC check
    if (isSupplier(ctx.role)) {
      if (!ctx.supplierProfileId || order.supplierId !== ctx.supplierProfileId) {
        res.status(403).json({ status: "error", message: "Forbidden" });
        return;
      }

      const parsed = SupplierUpdateOrderSchema.safeParse(body);
      if (!parsed.success) {
        res.status(400).json({ status: "error", message: "invalid_body" });
        return;
      }

      const nextStatus = parsed.data.status;

      if (!validateSupplierStatusTransition(order.status, nextStatus)) {
        console.info("orders.update.invalid_transition", {
          userId: authUserId,
          role: ctx.role,
          orderId: id,
          from: order.status,
          to: nextStatus,
        });
        res.status(400).json({
          status: "error",
          message: `invalid_status_transition: ${order.status} -> ${nextStatus}`,
        });
        return;
      }

      const updated = await prisma.order.update({
        where: { id },
        data: { status: nextStatus as any },
        include: { supplier: true, buyer: { select: { id: true, userEmail: true } } },
      });

      console.info("orders.update.success", {
        userId: authUserId,
        role: ctx.role,
        orderId: id,
        status: updated.status,
      });

      await createOrderStatusNotifications({
        id: updated.id,
        buyerId: updated.buyerId,
        supplierId: updated.supplierId,
        status: updated.status,
      });

      res.status(200).json({ status: "ok", order: updated });
      return;
    }

    if (isBuyer(ctx.role)) {
      // Buyer can view but not update status in W6 scope.
      res.status(403).json({ status: "error", message: "Forbidden" });
      return;
    }

    if (!isAdmin(ctx.role)) {
      res.status(403).json({ status: "error", message: "Forbidden" });
      return;
    }

    const parsed = AdminUpdateOrderSchema.safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ status: "error", message: "invalid_body" });
      return;
    }

    const data: any = {};
    if (parsed.data.status) data.status = parsed.data.status;
    if (parsed.data.totalAmount !== undefined) data.totalAmount = (parsed.data.totalAmount as number).toFixed(2);
    if (parsed.data.currency !== undefined) data.currency = parsed.data.currency.trim();

    const updated = await prisma.order.update({
      where: { id },
      data,
      include: { supplier: true, buyer: { select: { id: true, userEmail: true } } },
    });

    console.info("orders.update.success", {
      userId: authUserId,
      role: ctx.role,
      orderId: id,
      status: updated.status,
    });

    if (typeof body.status === "string" && body.status !== order.status) {
      await createOrderStatusNotifications({
        id: updated.id,
        buyerId: updated.buyerId,
        supplierId: updated.supplierId,
        status: updated.status,
      });
    }

    res.status(200).json({ status: "ok", order: updated });
  } catch (error) {
    console.error("orders.update.error", error);
    res.status(500).json({ status: "error", message: "failed_to_update_order" });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const ctx = await getUserContext(authUserId);
  if (!ctx) {
    res.status(401).json({ status: "error", message: "Unauthorized" });
    return;
  }

  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  try {
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      res.status(404).json({ status: "error", message: "order_not_found" });
      return;
    }

    if (isAdmin(ctx.role)) {
      await prisma.order.delete({ where: { id } });
      console.info("orders.delete.success", { userId: authUserId, role: ctx.role, orderId: id });
      res.status(204).send();
      return;
    }

    if (isBuyer(ctx.role) && order.buyerId === authUserId && order.status === "PENDING") {
      await prisma.order.delete({ where: { id } });
      console.info("orders.delete.success", { userId: authUserId, role: ctx.role, orderId: id });
      res.status(204).send();
      return;
    }

    console.info("orders.delete.forbidden", { userId: authUserId, role: ctx.role, orderId: id });
    res.status(403).json({ status: "error", message: "Forbidden" });
  } catch (error) {
    console.error("orders.delete.error", error);
    res.status(500).json({ status: "error", message: "failed_to_delete_order" });
  }
};
