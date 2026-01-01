import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { api } from "../lib/api";

import "./OrderDetail.css";

type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;

type Order = {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalAmount: any;
  currency: string;
  supplier?: { id: number; companyName: string };
  buyer?: { id: number; userEmail: string; firstName: string; lastName: string };
  quote?: { id: number; rfqId: number; totalPrice: any; currency: string; status: string };
};

type OrderResponse = { status: string; order: Order };

type MeResponse = {
  status: string;
  user: { id: number; email: string; firstName: string; lastName: string; role: string };
};

const formatMoney = (amount: any, currency: string) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount ?? "-"} ${currency}`;
  return `${n.toFixed(2)} ${currency}`;
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const normalized = String(status).toUpperCase();
  return <span className={`order-status order-status--${normalized}`}>{normalized}</span>;
};

const getNextSupplierStatus = (current: OrderStatus): OrderStatus | null => {
  const s = String(current).toUpperCase();
  if (s === "PENDING" || s === "CONFIRMED") return "IN_PROGRESS";
  if (s === "IN_PROGRESS") return "COMPLETED";
  return null;
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [order, setOrder] = useState<Order | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  const orderId = Number(id);

  const canAttemptUpdate = useMemo(() => {
    const r = (role ?? "").toUpperCase();
    return r === "ADMIN" || r === "SUPPLIER";
  }, [role]);

  const load = async () => {
    try {
      setError(null);

      const [meRes, orderRes] = await Promise.all([
        api.get<MeResponse>("/api/auth/me"),
        api.get<OrderResponse>(`/api/orders/${orderId}`),
      ]);

      setRole(meRes.data.user?.role ?? null);
      setOrder(orderRes.data.order);
    } catch (e: any) {
      setError(typeof e?.message === "string" ? e.message : "Failed to load order");
      setOrder(null);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (!Number.isFinite(orderId)) {
      setError("Invalid order id");
      return;
    }

    load();

    const interval = window.setInterval(() => {
      load();
    }, 10_000);

    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orderId]);

  const updateStatus = async () => {
    if (!order) return;
    const next = getNextSupplierStatus(order.status);

    if (!next) {
      setError("No valid next status for this order.");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      await api.patch(`/api/orders/${order.id}`, { status: next });
      await load();
    } catch (e: any) {
      setError(typeof e?.message === "string" ? e.message : "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (!token) {
    return (
      <div className="order-detail">
        <div className="banner banner--warn">
          Missing JWT. Please <button onClick={() => navigate("/login")}>log in</button>.
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <div className="order-detail__top">
        <Link to="/order">← Back to orders</Link>
        <h1>Order Details</h1>
      </div>

      {error && <div className="banner banner--error">{error}</div>}

      {order === null ? (
        <div className="muted">Loading...</div>
      ) : (
        <div className="order-detail__card">
          <div className="order-detail__row">
            <div className="label">Order</div>
            <div className="value">#{order.id}</div>
          </div>

          <div className="order-detail__row">
            <div className="label">Status</div>
            <div className="value">
              <StatusBadge status={order.status} />
            </div>
          </div>

          <div className="order-detail__row">
            <div className="label">Supplier</div>
            <div className="value">{order.supplier?.companyName ?? "-"}</div>
          </div>

          <div className="order-detail__row">
            <div className="label">Buyer</div>
            <div className="value">{order.buyer?.userEmail ?? "-"}</div>
          </div>

          <div className="order-detail__row">
            <div className="label">Total</div>
            <div className="value">{formatMoney(order.totalAmount, order.currency)}</div>
          </div>

          <div className="order-detail__row">
            <div className="label">Role</div>
            <div className="value">{role ?? "-"}</div>
          </div>

          <div className="order-detail__actions">
            <button className="primary" disabled={!canAttemptUpdate || updating} onClick={updateStatus}>
              {updating ? "Updating..." : "Advance status"}
            </button>
            {!canAttemptUpdate ? <div className="muted">(Only Supplier/Admin can update status)</div> : null}
          </div>
        </div>
      )}
    </div>
  );
}
