import type { CartItem } from "../types";

// Your latest Apps Script Web App URL
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzTSpvNe1yppLBPeP-ORRcVSlOWnL7cVS6F3mcbjPE8qxc1e52W0rxSFyZg8s2TReqn/exec";

export async function sendOrderToGoogleSheet(params: {
  items: CartItem[];
  total: number;
  messageText: string; // readable message (not url-encoded)
}) {
  const payload = {
    source: "chaunsa-gold-website",
    time: new Date().toISOString(),
    total: params.total,
    items: params.items.map((i) => ({
      id: i.id,
      name: i.name,
      qty: i.quantity,
      unit: i.unit,
      price: i.price,
      subtotal: i.price * i.quantity,
    })),
    message: params.messageText,
  };

  // IMPORTANT: text/plain avoids CORS preflight in many cases
  await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
    keepalive: true,
  });
}
