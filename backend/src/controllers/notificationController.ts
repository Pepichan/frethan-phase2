import type { Request, Response } from "express";

import { prisma } from "../app";

const parseIntId = (value: unknown) => {
  const n = typeof value === "string" ? Number(value) : typeof value === "number" ? value : NaN;
  return Number.isFinite(n) ? Math.trunc(n) : null;
};

export const listNotifications = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const limitRaw = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(1, limitRaw as number), 100) : 50;

  try {
    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: authUserId },
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({ where: { userId: authUserId, isRead: false } }),
    ]);

    res.status(200).json({ status: "ok", unreadCount, notifications });
  } catch (error) {
    console.error("notifications.list.error", error);
    res.status(500).json({ status: "error", message: "failed_to_list_notifications" });
  }
};

export const markNotificationRead = async (req: Request, res: Response) => {
  const authUserId = req.auth?.userId;
  if (!authUserId) {
    res.status(401).json({ status: "error", message: "Missing JWT" });
    return;
  }

  const id = parseIntId(req.params.id);
  if (!id) {
    res.status(400).json({ status: "error", message: "invalid_id" });
    return;
  }

  try {
    const existing = await prisma.notification.findFirst({ where: { id, userId: authUserId } });
    if (!existing) {
      res.status(404).json({ status: "error", message: "notification_not_found" });
      return;
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    const unreadCount = await prisma.notification.count({ where: { userId: authUserId, isRead: false } });

    res.status(200).json({ status: "ok", unreadCount, notification: updated });
  } catch (error) {
    console.error("notifications.read.error", error);
    res.status(500).json({ status: "error", message: "failed_to_mark_read" });
  }
};
