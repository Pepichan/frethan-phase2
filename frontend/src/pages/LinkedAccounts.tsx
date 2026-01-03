import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import facebookIcon from "../assets/facebook.png";
import wechatIcon from "../assets/wechat.png";
import { api } from "../lib/api";

type Provider = "google" | "facebook" | "wechat";

type LinkedAccountsResponse = {
  status: "ok";
  linked: {
    google: boolean;
    facebook: boolean;
    wechat: boolean;
  };
};

const providerLabel: Record<Provider, string> = {
  google: "Google",
  facebook: "Facebook",
  wechat: "WeChat (Demo Flow)",
};

const LinkedAccounts: React.FC = () => {
  const location = useLocation();

  const [linked, setLinked] = useState<LinkedAccountsResponse["linked"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyProvider, setBusyProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<LinkedAccountsResponse>("/api/auth/linked-accounts");
      setLinked(res.data.linked);
    } catch (e: unknown) {
      const message = typeof (e as { message?: unknown } | null)?.message === "string" ? (e as { message: string }).message : "Failed to load linked accounts";
      setError(message);
      setLinked(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    const provider = query.get("provider");
    const linkedParam = query.get("linked");
    const err = query.get("error");

    const isProvider = (value: string | null): value is Provider =>
      value === "google" || value === "facebook" || value === "wechat";

    if (isProvider(provider) && linkedParam === "1") {
      setToast(`${providerLabel[provider]} connected`);
      window.history.replaceState({}, document.title, "/settings/linked-accounts");
      return;
    }

    if (isProvider(provider) && typeof err === "string") {
      setError(`${providerLabel[provider]}: ${err}`);
      window.history.replaceState({}, document.title, "/settings/linked-accounts");
      return;
    }
  }, [query]);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const connect = async (provider: Provider) => {
    setError(null);
    setToast(null);

    if (provider === "google" || provider === "facebook") {
      setBusyProvider(provider);
      window.location.assign(`/api/auth/${provider}/link`);
      return;
    }

    setBusyProvider(provider);
    try {
      await api.post("/api/auth/wechat/link");
      setToast("WeChat (Demo Flow) connected");
      await load();
    } catch (e: unknown) {
      const message = typeof (e as { message?: unknown } | null)?.message === "string" ? (e as { message: string }).message : "Failed to connect";
      setError(message);
    } finally {
      setBusyProvider(null);
    }
  };

  const disconnect = async (provider: Provider) => {
    setError(null);
    setToast(null);

    const ok = window.confirm(`Disconnect ${providerLabel[provider]}?`);
    if (!ok) return;

    setBusyProvider(provider);
    try {
      await api.post(`/api/auth/${provider}/unlink`);
      setToast(`${providerLabel[provider]} disconnected`);
      await load();
    } catch (e: unknown) {
      const message = typeof (e as { message?: unknown } | null)?.message === "string" ? (e as { message: string }).message : "Failed to disconnect";
      setError(message);
    } finally {
      setBusyProvider(null);
    }
  };

  return (
    <div style={{ padding: 40, maxWidth: 840, margin: "0 auto" }}>
      <h1 style={{ marginBottom: 8 }}>Settings</h1>
      <h2 style={{ marginTop: 0, marginBottom: 20 }}>Linked Accounts</h2>

      {toast && (
        <div role="status" style={{ marginBottom: 12, padding: 10, border: "1px solid #ccc" }}>
          {toast}
        </div>
      )}

      {error && (
        <div role="alert" style={{ marginBottom: 12, padding: 10, border: "1px solid #cc0000" }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Loading…</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {([
            "google",
            "facebook",
            "wechat",
          ] as Provider[]).map((provider) => {
            const isLinked = Boolean(linked?.[provider]);
            const isBusy = busyProvider === provider;

            return (
              <div
                key={provider}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                  padding: 14,
                  border: "1px solid #ddd",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {provider === "facebook" ? (
                    <img src={facebookIcon} alt="Facebook" width={28} height={28} />
                  ) : provider === "wechat" ? (
                    <img src={wechatIcon} alt="WeChat" width={28} height={28} />
                  ) : (
                    <div
                      aria-label="Google"
                      style={{
                        width: 28,
                        height: 28,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd",
                        fontWeight: 700,
                      }}
                    >
                      G
                    </div>
                  )}

                  <div>
                    <div style={{ fontWeight: 600 }}>{providerLabel[provider]}</div>
                    <div style={{ fontSize: 14, opacity: 0.8 }}>{isLinked ? "Linked" : "Not linked"}</div>
                  </div>
                </div>

                {isLinked ? (
                  <button type="button" disabled={isBusy} onClick={() => void disconnect(provider)}>
                    {isBusy ? "Disconnecting…" : "Disconnect"}
                  </button>
                ) : (
                  <button type="button" disabled={isBusy} onClick={() => void connect(provider)}>
                    {isBusy ? "Connecting…" : "Connect"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LinkedAccounts;
