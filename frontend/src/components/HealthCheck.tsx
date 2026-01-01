import React from "react";

import { api } from "../lib/api";

type HealthState =
  | { status: "idle" | "loading" }
  | { status: "ok"; message?: string }
  | { status: "error"; message?: string };

export default function HealthCheck() {
  const [state, setState] = React.useState<HealthState>({ status: "idle" });

  React.useEffect(() => {
    if (import.meta.env.MODE === "test") {
      return;
    }

    let cancelled = false;

    const run = async () => {
      setState({ status: "loading" });
      try {
        const res = await api.get<{ message?: string }>("/api/health");
        if (cancelled) return;
        const msg = typeof res.data?.message === "string" ? res.data.message : undefined;
        setState({ status: "ok", message: msg });
      } catch (e: any) {
        if (cancelled) return;
        const msg = typeof e?.message === "string" ? e.message : "Failed to reach backend /api/health";
        setState({ status: "error", message: msg });
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const text =
    state.status === "loading"
      ? "Backend health: checking..."
      : state.status === "ok"
        ? `Backend health: OK${state.message ? ` (${state.message})` : ""}`
        : state.status === "error"
          ? `Backend health: ERROR${state.message ? ` (${state.message})` : ""}`
          : "";

  return <div className="health-check">{text}</div>;
}
