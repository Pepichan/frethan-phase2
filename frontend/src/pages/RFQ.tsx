import React, { useEffect, useMemo, useState } from "react";

type RfqItem = {
  id: number;
  description: string;
  quantity: unknown;
  unit: string;
};

type QuoteItem = {
  id: number;
  rfqItemId: number;
  unitPrice: unknown;
  quantity: unknown;
  subtotal: unknown;
};

type Quote = {
  id: number;
  supplierId: number;
  totalPrice: unknown;
  currency: string;
  status: string;
  createdAt: string;
  items: QuoteItem[];
};

type Rfq = {
  id: number;
  buyerId: number;
  notes?: string | null;
  status: string;
  currency: string;
  createdAt: string;
  items: RfqItem[];
  quotes?: Quote[];
};

export default function RFQ() {
  const [rfqs, setRfqs] = useState<Rfq[]>([]);
  const [selectedRfqId, setSelectedRfqId] = useState<number | null>(null);
  const [selectedRfq, setSelectedRfq] = useState<Rfq | null>(null);

  // Create RFQ form
  const [buyerId, setBuyerId] = useState("1");
  const [notes, setNotes] = useState("Test RFQ");
  const [itemDesc, setItemDesc] = useState("Steel rods");
  const [itemQty, setItemQty] = useState("10");
  const [itemUnit, setItemUnit] = useState("pcs");

  // Quote form (supplier submits)
  const [supplierId, setSupplierId] = useState("1");
  const [unitPriceByItemId, setUnitPriceByItemId] = useState<Record<number, string>>({});

  const loadRfqs = async () => {
    const res = await fetch("/api/rfqs");
    const data = await res.json();
    setRfqs(Array.isArray(data?.rfqs) ? data.rfqs : []);
  };

  const loadRfqDetail = async (rfqId: number) => {
    const res = await fetch(`/api/rfqs/${rfqId}`);
    const data = await res.json();
    setSelectedRfq(data?.rfq ?? null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRfqs().catch((e: unknown) => console.error(e));
  }, []);

  useEffect(() => {
    if (!selectedRfqId) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadRfqDetail(selectedRfqId).catch((e: unknown) => console.error(e));
  }, [selectedRfqId]);

  const selectedItems = useMemo(() => selectedRfq?.items ?? [], [selectedRfq]);

  const computedTotal = useMemo(() => {
    if (!selectedRfq) return null;
    let total = 0;
    for (const it of selectedItems) {
      const qty = Number(it.quantity);
      const up = Number(unitPriceByItemId[it.id]);
      if (Number.isFinite(qty) && Number.isFinite(up)) {
        total += qty * up;
      }
    }
    return total;
  }, [selectedRfq, selectedItems, unitPriceByItemId]);

  const onSelectRfq = async (id: number) => {
    setSelectedRfqId(id);
    setSelectedRfq(null);
    await loadRfqDetail(id);
  };

  const onCreateRfq = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      buyerId: Number(buyerId),
      notes,
      currency: "AUD",
      items: [
        {
          description: itemDesc,
          quantity: Number(itemQty),
          unit: itemUnit,
        },
      ],
    };

    const res = await fetch("/api/rfqs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Create RFQ failed: ${err?.message ?? res.status}`);
      return;
    }

    await loadRfqs();
  };

  const onSubmitQuote = async () => {
    if (!selectedRfq) return;

    const items = selectedItems
      .map((it) => ({
        rfqItemId: it.id,
        unitPrice: Number(unitPriceByItemId[it.id]),
      }))
      .filter((it) => Number.isFinite(it.unitPrice));

    if (items.length === 0) {
      alert("Please enter at least one unit price.");
      return;
    }

    const payload = {
      rfqId: selectedRfq.id,
      supplierId: Number(supplierId),
      currency: selectedRfq.currency,
      items,
    };

    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(`Submit quote failed: ${err?.message ?? res.status}`);
      return;
    }

    await loadRfqDetail(selectedRfq.id);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>RFQ</h1>

      <section style={{ marginTop: "1rem" }}>
        <h2>Create RFQ</h2>
        <form onSubmit={onCreateRfq} style={{ display: "grid", gap: "0.5rem", maxWidth: 520 }}>
          <label>
            Buyer ID
            <input value={buyerId} onChange={(e) => setBuyerId(e.target.value)} />
          </label>
          <label>
            Notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} />
          </label>
          <label>
            Item description
            <input value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} />
          </label>
          <label>
            Quantity
            <input value={itemQty} onChange={(e) => setItemQty(e.target.value)} />
          </label>
          <label>
            Unit
            <input value={itemUnit} onChange={(e) => setItemUnit(e.target.value)} />
          </label>
          <button type="submit">Create</button>
        </form>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>RFQs</h2>
        {rfqs.length === 0 ? (
          <p>No RFQs yet.</p>
        ) : (
          <ul>
            {rfqs.map((r) => (
              <li key={r.id}>
                <button type="button" onClick={() => void onSelectRfq(r.id)}>
                  #{r.id} ({r.status}) - {r.items?.length ?? 0} items
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {selectedRfq && (
        <section style={{ marginTop: "2rem" }}>
          <h2>RFQ Detail: #{selectedRfq.id}</h2>
          <p>Status: {selectedRfq.status}</p>
          <p>Notes: {selectedRfq.notes ?? "-"}</p>

          <h3>Items</h3>
          {selectedItems.length === 0 ? (
            <p>No items</p>
          ) : (
            <table style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ border: "1px solid #ddd", padding: "6px" }}>Description</th>
                  <th style={{ border: "1px solid #ddd", padding: "6px" }}>Qty</th>
                  <th style={{ border: "1px solid #ddd", padding: "6px" }}>Unit</th>
                  <th style={{ border: "1px solid #ddd", padding: "6px" }}>Unit price</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((it) => (
                  <tr key={it.id}>
                    <td style={{ border: "1px solid #ddd", padding: "6px" }}>{it.description}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px" }}>{String(it.quantity)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px" }}>{it.unit}</td>
                    <td style={{ border: "1px solid #ddd", padding: "6px" }}>
                      <input
                        value={unitPriceByItemId[it.id] ?? ""}
                        onChange={(e) =>
                          setUnitPriceByItemId((prev) => ({ ...prev, [it.id]: e.target.value }))
                        }
                        placeholder="e.g. 12.5"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div style={{ marginTop: "1rem", display: "grid", gap: "0.5rem", maxWidth: 360 }}>
            <label>
              Supplier ID
              <input value={supplierId} onChange={(e) => setSupplierId(e.target.value)} />
            </label>
            <button type="button" onClick={onSubmitQuote}>
              Submit Quote
            </button>
            {computedTotal !== null && <div>Computed total: {computedTotal}</div>}
          </div>

          <h3 style={{ marginTop: "1.5rem" }}>Quotes</h3>
          {Array.isArray(selectedRfq.quotes) && selectedRfq.quotes.length > 0 ? (
            <ul>
              {selectedRfq.quotes.map((q) => (
                <li key={q.id}>
                  Quote #{q.id} supplier={q.supplierId} total={String(q.totalPrice)} {q.currency}
                </li>
              ))}
            </ul>
          ) : (
            <p>No quotes yet.</p>
          )}
        </section>
      )}
    </div>
  );
}
