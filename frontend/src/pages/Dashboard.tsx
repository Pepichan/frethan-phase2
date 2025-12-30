import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { api } from "../lib/api";
import type { Quote, Rfq } from "../types/rfq";

type CreateRfqItemDraft = {
  description: string;
  quantity: string;
  unit: string;
};

type QuoteItemDraft = {
  rfqItemId: number;
  unitPrice: string;
  quantity: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(null);
  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [createBuyerId, setCreateBuyerId] = useState("1");
  const [createCurrency, setCreateCurrency] = useState("AUD");
  const [createRequiredBy, setCreateRequiredBy] = useState<string>("");
  const [createNotes, setCreateNotes] = useState<string>("");
  const [createItems, setCreateItems] = useState<CreateRfqItemDraft[]>([
    { description: "", quantity: "", unit: "" },
  ]);

  const [quoteSupplierId, setQuoteSupplierId] = useState("1");
  const [quoteCurrency, setQuoteCurrency] = useState<string>("");
  const [quoteValidityUntil, setQuoteValidityUntil] = useState<string>("");
  const [quoteItems, setQuoteItems] = useState<QuoteItemDraft[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to access the dashboard.");
      navigate("/login");
    }
  }, []);

  const loadRfqs = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await api.get<Rfq[]>("/api/rfqs");
      setRfqs(res.data);
    } catch {
      setError("RFQ一覧の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const loadRfq = async (rfqId: number) => {
    setError(null);
    setNotice(null);
    setIsLoading(true);
    try {
      const res = await api.get<Rfq>(`/api/rfqs/${rfqId}`);
      setSelectedRfq(res.data);
      setSelectedRfqId(rfqId);

      const nextQuoteItems: QuoteItemDraft[] = (res.data.items || []).map((it) => ({
        rfqItemId: it.id,
        unitPrice: "",
        quantity: it.quantity || "",
      }));
      setQuoteItems(nextQuoteItems);
    } catch {
      setError("RFQ詳細の取得に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadRfqs();
  }, []);

  const selectedRfqQuotes = useMemo(() => {
    if (!selectedRfq) return [] as Quote[];
    return Array.isArray(selectedRfq.quotes) ? selectedRfq.quotes : [];
  }, [selectedRfq]);

  const onCreateItemChange = (index: number, field: keyof CreateRfqItemDraft, value: string) => {
    setCreateItems((prev) =>
      prev.map((it, i) => (i === index ? { ...it, [field]: value } : it))
    );
  };

  const addCreateItemRow = () => {
    setCreateItems((prev) => [...prev, { description: "", quantity: "", unit: "" }]);
  };

  const removeCreateItemRow = (index: number) => {
    setCreateItems((prev) => prev.filter((_, i) => i !== index));
  };

  const createRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setIsLoading(true);

    try {
      const buyerId = Number(createBuyerId);
      if (!Number.isFinite(buyerId) || buyerId <= 0) {
        setError("buyerId は正の整数で入力してください");
        return;
      }

      const items = createItems
        .map((it) => ({
          description: it.description.trim(),
          quantity: it.quantity,
          unit: it.unit.trim(),
        }))
        .filter((it) => it.description && it.unit && String(it.quantity).trim() !== "");

      const payload: any = {
        buyerId,
        currency: createCurrency.trim() || undefined,
        notes: createNotes.trim() || undefined,
        requiredBy: createRequiredBy.trim() || undefined,
        items,
      };

      const res = await api.post<Rfq>("/api/rfqs", payload);
      setNotice("RFQを作成しました");
      await loadRfqs();
      await loadRfq(res.data.id);

      setCreateNotes("");
      setCreateRequiredBy("");
      setCreateItems([{ description: "", quantity: "", unit: "" }]);
    } catch {
      setError("RFQ作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const addRfqItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqId) return;

    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    const description = String(fd.get("description") || "").trim();
    const unit = String(fd.get("unit") || "").trim();
    const quantity = String(fd.get("quantity") || "").trim();

    if (!description || !unit || !quantity) {
      setError("アイテムの description / unit / quantity を入力してください");
      return;
    }

    setError(null);
    setNotice(null);
    setIsLoading(true);
    try {
      await api.post(`/api/rfqs/${selectedRfqId}/items`, {
        description,
        unit,
        quantity,
      });
      setNotice("RFQアイテムを追加しました");
      await loadRfq(selectedRfqId);
      form.reset();
    } catch {
      setError("RFQアイテム追加に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const onQuoteItemChange = (rfqItemId: number, field: "unitPrice" | "quantity", value: string) => {
    setQuoteItems((prev) =>
      prev.map((it) => (it.rfqItemId === rfqItemId ? { ...it, [field]: value } : it))
    );
  };

  const submitQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRfqId || !selectedRfq) return;

    setError(null);
    setNotice(null);
    setIsLoading(true);

    try {
      const supplierId = Number(quoteSupplierId);
      if (!Number.isFinite(supplierId) || supplierId <= 0) {
        setError("supplierId は正の整数で入力してください");
        return;
      }

      const items = quoteItems
        .map((it) => ({
          rfqItemId: it.rfqItemId,
          unitPrice: it.unitPrice,
          quantity: it.quantity,
        }))
        .filter((it) => String(it.unitPrice).trim() !== "" && String(it.quantity).trim() !== "");

      if (items.length === 0) {
        setError("見積の unitPrice と quantity を入力してください");
        return;
      }

      const payload: any = {
        supplierId,
        currency: quoteCurrency.trim() || undefined,
        validityUntil: quoteValidityUntil.trim() || undefined,
        items,
      };

      await api.post(`/api/rfqs/${selectedRfqId}/quotes`, payload);
      setNotice("見積（Quote）を送信しました");
      await loadRfq(selectedRfqId);
    } catch {
      setError("見積（Quote）の送信に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ padding: "2rem" }}>
      <h1>Dashboard</h1>

      {error && <div style={{ margin: "0.75rem 0" }}>{error}</div>}
      {notice && <div style={{ margin: "0.75rem 0" }}>{notice}</div>}

      <section style={{ marginTop: "1.5rem" }}>
        <h2>RFQ 作成</h2>
        <form onSubmit={createRfq}>
          <div style={{ display: "grid", gap: "0.75rem", maxWidth: 720 }}>
            <label>
              buyerId
              <input
                value={createBuyerId}
                onChange={(e) => setCreateBuyerId(e.target.value)}
                inputMode="numeric"
              />
            </label>
            <label>
              currency
              <input value={createCurrency} onChange={(e) => setCreateCurrency(e.target.value)} />
            </label>
            <label>
              requiredBy（ISO / 例: 2026-01-15）
              <input
                value={createRequiredBy}
                onChange={(e) => setCreateRequiredBy(e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </label>
            <label>
              notes
              <textarea value={createNotes} onChange={(e) => setCreateNotes(e.target.value)} />
            </label>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <strong>Items</strong>
                <button type="button" onClick={addCreateItemRow}>
                  + 追加
                </button>
              </div>

              <div style={{ display: "grid", gap: "0.5rem", marginTop: "0.5rem" }}>
                {createItems.map((it, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr auto",
                      gap: "0.5rem",
                      alignItems: "center",
                    }}
                  >
                    <input
                      placeholder="description"
                      value={it.description}
                      onChange={(e) => onCreateItemChange(idx, "description", e.target.value)}
                    />
                    <input
                      placeholder="quantity"
                      value={it.quantity}
                      onChange={(e) => onCreateItemChange(idx, "quantity", e.target.value)}
                    />
                    <input
                      placeholder="unit"
                      value={it.unit}
                      onChange={(e) => onCreateItemChange(idx, "unit", e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => removeCreateItemRow(idx)}
                      disabled={createItems.length <= 1}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" disabled={isLoading}>
              RFQ作成
            </button>
          </div>
        </form>
      </section>

      <section style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "1.5rem" }}>
        <div>
          <h2>RFQ 一覧</h2>
          <button type="button" onClick={() => void loadRfqs()} disabled={isLoading}>
            再読み込み
          </button>
          <div style={{ marginTop: "0.75rem", display: "grid", gap: "0.5rem" }}>
            {rfqs.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => void loadRfq(r.id)}
                style={{ textAlign: "left" }}
              >
                <div>
                  <strong>RFQ #{r.id}</strong>（buyerId: {r.buyerId}）
                </div>
                <div>items: {Array.isArray(r.items) ? r.items.length : 0}</div>
              </button>
            ))}
            {rfqs.length === 0 && <div>RFQがありません</div>}
          </div>
        </div>

        <div>
          <h2>RFQ 詳細</h2>
          {!selectedRfq && <div>左の一覧からRFQを選択してください</div>}

          {selectedRfq && (
            <div style={{ display: "grid", gap: "1rem" }}>
              <div>
                <div>
                  <strong>RFQ #{selectedRfq.id}</strong>
                </div>
                <div>buyerId: {selectedRfq.buyerId}</div>
                <div>status: {selectedRfq.status || ""}</div>
                <div>currency: {selectedRfq.currency || ""}</div>
                <div>requiredBy: {selectedRfq.requiredBy || ""}</div>
                <div>notes: {selectedRfq.notes || ""}</div>
              </div>

              <div>
                <strong>Items</strong>
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.25rem" }}>
                  {selectedRfq.items.map((it) => (
                    <div key={it.id}>
                      #{it.id} {it.description} / {it.quantity} {it.unit}
                    </div>
                  ))}
                  {selectedRfq.items.length === 0 && <div>itemsがありません</div>}
                </div>
              </div>

              <div>
                <strong>アイテム追加</strong>
                <form onSubmit={addRfqItem} style={{ marginTop: "0.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "0.5rem" }}>
                    <input name="description" placeholder="description" />
                    <input name="quantity" placeholder="quantity" />
                    <input name="unit" placeholder="unit" />
                    <button type="submit" disabled={isLoading}>
                      追加
                    </button>
                  </div>
                </form>
              </div>

              <div>
                <strong>Supplier Quotes</strong>
                <div style={{ marginTop: "0.5rem", display: "grid", gap: "0.75rem" }}>
                  {selectedRfqQuotes.map((q) => (
                    <div key={q.id} style={{ padding: "0.75rem", border: "1px solid" }}>
                      <div>
                        <strong>Quote #{q.id}</strong>（supplierId: {q.supplierId}）
                      </div>
                      <div>
                        total: {q.totalPrice} {q.currency}
                      </div>
                      <div>validityUntil: {q.validityUntil || ""}</div>
                      <div style={{ marginTop: "0.5rem" }}>
                        {q.items.map((qi) => (
                          <div key={qi.id}>
                            rfqItemId: {qi.rfqItemId} / unitPrice: {qi.unitPrice} / qty: {qi.quantity} / subtotal: {qi.subtotal}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {selectedRfqQuotes.length === 0 && <div>まだ見積はありません</div>}
                </div>
              </div>

              <div>
                <strong>見積（Quote）を送信</strong>
                <form onSubmit={submitQuote} style={{ marginTop: "0.5rem" }}>
                  <div style={{ display: "grid", gap: "0.75rem" }}>
                    <label>
                      supplierId
                      <input
                        value={quoteSupplierId}
                        onChange={(e) => setQuoteSupplierId(e.target.value)}
                        inputMode="numeric"
                      />
                    </label>
                    <label>
                      currency（未入力ならRFQのcurrency）
                      <input value={quoteCurrency} onChange={(e) => setQuoteCurrency(e.target.value)} />
                    </label>
                    <label>
                      validityUntil（ISO / 例: 2026-02-01）
                      <input
                        value={quoteValidityUntil}
                        onChange={(e) => setQuoteValidityUntil(e.target.value)}
                        placeholder="YYYY-MM-DD"
                      />
                    </label>

                    <div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <strong>Items</strong>
                      </div>
                      <div style={{ display: "grid", gap: "0.5rem" }}>
                        {selectedRfq.items.map((it) => {
                          const row = quoteItems.find((qi) => qi.rfqItemId === it.id);
                          return (
                            <div
                              key={it.id}
                              style={{
                                display: "grid",
                                gridTemplateColumns: "2fr 1fr 1fr",
                                gap: "0.5rem",
                                alignItems: "center",
                              }}
                            >
                              <div>
                                #{it.id} {it.description}
                              </div>
                              <input
                                placeholder="unitPrice"
                                value={row?.unitPrice || ""}
                                onChange={(e) => onQuoteItemChange(it.id, "unitPrice", e.target.value)}
                              />
                              <input
                                placeholder="quantity"
                                value={row?.quantity || ""}
                                onChange={(e) => onQuoteItemChange(it.id, "quantity", e.target.value)}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <button type="submit" disabled={isLoading}>
                      Quote送信
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
