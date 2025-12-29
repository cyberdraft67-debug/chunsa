import type { CartItem } from "../types";

// Your latest Apps Script Web App URL
const WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbxoDsuO1ftN4XSZYQDugtx1zWO0nSTGU0TzvoOrWLcTc5b1cYmRoA-H5NjGQGIpNmYk/exec";

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
