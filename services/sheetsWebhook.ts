
import { GOOGLE_SHEETS_WEBHOOK_URL } from "../constants";
import type { CartItem } from "../types";

export interface OrderPayload {
  orderId: string;
  name: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
}

export async function sendOrderToSheet(payload: OrderPayload) {
  if (!GOOGLE_SHEETS_WEBHOOK_URL) {
    console.warn("Google Sheets URL is not configured.");
    return;
  }

  const data = {
    ...payload,
    itemSummary: payload.items.map(i => `${i.quantity}x ${i.name}`).join(', '),
    timestamp: new Date().toISOString(),
    source: "Chaunsa Gold Web Store"
  };

  try {
    // We use no-cors if the Apps Script is not configured for CORS, 
    // but usually POST with JSON works best.
    await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors", // Essential for Google Apps Script webhooks
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    console.log("Order logged to database successfully.");
  } catch (err) {
    console.error("Database sync failed:", err);
  }
}
