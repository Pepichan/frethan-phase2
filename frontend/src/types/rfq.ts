export type RfqItem = {
  id: number;
  rfqId: number;
  productId?: number | null;
  description: string;
  quantity: string;
  unit: string;
};

export type QuoteItem = {
  id: number;
  quoteId: number;
  rfqItemId: number;
  unitPrice: string;
  quantity: string;
  subtotal: string;
};

export type Quote = {
  id: number;
  rfqId: number;
  supplierId: number;
  totalPrice: string;
  currency: string;
  validityUntil?: string | null;
  createdAt?: string;
  items: QuoteItem[];
};

export type Rfq = {
  id: number;
  buyerId: number;
  status?: string;
  requiredBy?: string | null;
  notes?: string | null;
  currency?: string;
  createdAt?: string;
  items: RfqItem[];
  quotes?: Quote[];
};
