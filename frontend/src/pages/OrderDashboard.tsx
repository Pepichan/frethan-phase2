import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { api } from "../lib/api";

import "./OrderDashboard.css";

type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;

type OrderListItem = {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalAmount: unknown;
  currency: string;
  supplier?: { id: number; companyName: string };
  buyer?: { id: number; userEmail: string; firstName: string; lastName: string };
};

type NotificationItem = {
  id: number;
  orderId?: number | null;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type OrdersResponse = { status: string; orders: OrderListItem[] };

type NotificationsResponse = {
  status: string;
  unreadCount: number;
  notifications: NotificationItem[];
};

type Filter = "pending" | "completed";

const isCompleted = (status: OrderStatus) => String(status).toUpperCase() === "COMPLETED";

const formatMoney = (amount: unknown, currency: string) => {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${amount ?? "-"} ${currency}`;
  return `${n.toFixed(2)} ${currency}`;
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const normalized = String(status).toUpperCase();
  return <span className={`order-status order-status--${normalized}`}>{normalized}</span>;
};

export default function OrderDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filter>("pending");

  const [orders, setOrders] = useState<OrderListItem[] | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<NotificationItem[] | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifError, setNotifError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  const loadOrders = React.useCallback(async () => {
    try {
      setOrdersError(null);
      const res = await api.get<OrdersResponse>("/api/orders");
      setOrders(res.data.orders ?? []);
    } catch (e: unknown) {
      const msg =
        typeof (e as { message?: unknown } | null)?.message === "string"
          ? String((e as { message?: unknown }).message)
          : "Failed to load orders";
      setOrdersError(msg);
      setOrders([]);
    }
  }, []);

  const loadNotifications = React.useCallback(async () => {
    try {
      setNotifError(null);
      const res = await api.get<NotificationsResponse>("/api/notifications?limit=10");
      setNotifications(res.data.notifications ?? []);
      setUnreadCount(Number(res.data.unreadCount ?? 0));
    } catch (e: unknown) {
      const msg =
        typeof (e as { message?: unknown } | null)?.message === "string"
          ? String((e as { message?: unknown }).message)
          : "Failed to load notifications";
      setNotifError(msg);
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();
    loadNotifications();

    const interval = window.setInterval(() => {
      loadNotifications();
      loadOrders();
    }, 10_000);

    return () => {
      window.clearInterval(interval);
    };
  }, [token, loadNotifications, loadOrders]);

  const filteredOrders = useMemo(() => {
    const list = orders ?? [];
    if (filter === "completed") return list.filter((o) => isCompleted(o.status));
    return list.filter((o) => !isCompleted(o.status));
  }, [orders, filter]);

  const markRead = async (id: number) => {
    try {
      await api.patch("/api/notifications/" + id + "/read", {});
      await loadNotifications();
    } catch (e: unknown) {
      const msg =
        typeof (e as { message?: unknown } | null)?.message === "string"
          ? String((e as { message?: unknown }).message)
          : "Failed to mark notification as read";
      setNotifError(msg);
    }
  };

  if (!token) {
    return (
      <div className="order-page">
        <div className="banner banner--warn">
          Missing JWT. Please <button onClick={() => navigate("/login")}>log in</button>.
        </div>
      </div>
    );
  }

  const showLoading = orders === null;

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>Order Dashboard</h1>
        <div className="order-header__right">
          <div className="notif-pill">Notifications: {unreadCount} unread</div>
        </div>
      </div>

      {(ordersError || notifError) && (
        <div className="banner banner--error">
          {ordersError ? `API fail (orders): ${ordersError}` : null}
          {ordersError && notifError ? " | " : null}
          {notifError ? `API fail (notifications): ${notifError}` : null}
        </div>
      )}

      <div className="order-filters">
        <button
          className={filter === "pending" ? "tab tab--active" : "tab"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
        <button
          className={filter === "completed" ? "tab tab--active" : "tab"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
      </div>

      <div className="order-content">
        <section className="orders-card">
          <h2>Orders</h2>

          {showLoading && <div className="muted">Loading...</div>}

          {!showLoading && filteredOrders.length === 0 && <div className="muted">No orders to display.</div>}

          {!showLoading && filteredOrders.length > 0 && (
            <ul className="orders-list">
              {filteredOrders.map((o) => (
                <li key={o.id} className="orders-list__item">
                  <Link className="orders-list__link" to={`/order/${o.id}`}>
                    <div className="orders-list__top">
                      <div className="orders-list__title">Order #{o.id}</div>
                      <StatusBadge status={o.status} />
                    </div>

                    <div className="orders-list__meta">
                      <div>Supplier: {o.supplier?.companyName ?? "-"}</div>
                      <div>Total: {formatMoney(o.totalAmount, o.currency)}</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="notif-card">
          <h2>Recent Notifications</h2>

          {notifications === null && <div className="muted">Loading...</div>}
          {notifications !== null && notifications.length === 0 && <div className="muted">No notifications.</div>}

          {notifications !== null && notifications.length > 0 && (
            <ul className="notif-list">
              {notifications.map((n) => (
                <li key={n.id} className={n.isRead ? "notif-item" : "notif-item notif-item--unread"}>
                  <div className="notif-item__msg">{n.message}</div>
                  <div className="notif-item__actions">
                    {n.orderId ? <Link to={`/order/${n.orderId}`}>View order</Link> : null}
                    {!n.isRead ? (
                      <button className="link-button" onClick={() => markRead(n.id)}>
                        Mark read
                      </button>
                    ) : (
                      <span className="muted">Read</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
