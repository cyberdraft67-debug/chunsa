import { useCart } from "../context/CartContext";
import { sendOrderToGoogleSheet } from "../services/sheetsWebhook";

const WHATSAPP_NUMBER = "9232175625"; // 🔴 CHANGE THIS (without +)

export default function CartDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart();

  const handleWhatsAppOrder = async () => {
    if (items.length === 0) return;

    /* ===========================
       WhatsApp message (URL encoded)
       =========================== */
    let waMessage = `*Royal Order: Chaunsa Gold*%0A%0A`;
    waMessage += `I would like to place the following order:%0A`;

    items.forEach((item, index) => {
      waMessage += `%0A${index + 1}. *${item.name}*`;
      waMessage += `%0A   Qty: ${item.quantity} (${item.unit})`;
      waMessage += `%0A   Subtotal: Rs. ${(item.price * item.quantity).toLocaleString()}%0A`;
    });

    waMessage += `%0A*Total: Rs. ${total.toLocaleString()}*%0A%0A`;
    waMessage += `Please confirm availability and delivery details.`;

    /* ===========================
       Clean message for Google Sheet
       =========================== */
    const sheetMessage =
      `Royal Order: Chaunsa Gold\n\n` +
      `Order Details:\n\n` +
      items
        .map(
          (item, index) =>
            `${index + 1}. ${item.name}\n` +
            `   Qty: ${item.quantity} (${item.unit})\n` +
            `   Subtotal: Rs. ${(item.price * item.quantity).toLocaleString()}\n`
        )
        .join("\n") +
      `\nTotal: Rs. ${total.toLocaleString()}\n\n` +
      `Please confirm availability and delivery details.`;

    /* ===========================
       SEND TO GOOGLE SHEET
       =========================== */
    try {
      await sendOrderToGoogleSheet({
        items,
        total,
        messageText: sheetMessage,
      });
    } catch (err) {
      console.log("Google Sheet error:", err);
    }

    /* ===========================
       OPEN WHATSAPP
       =========================== */
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 && (
            <p className="text-gray-500 text-center">Your cart is empty</p>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-3 flex justify-between items-start"
            >
              <div>
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">
                  Rs. {item.price.toLocaleString()} / {item.unit}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="px-2 border rounded"
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="px-2 border rounded"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="font-medium">
                  Rs. {(item.price * item.quantity).toLocaleString()}
                </p>
                <button
                  className="text-red-500 text-sm mt-2"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="border-t p-4 space-y-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rs. {total.toLocaleString()}</span>
          </div>

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            onClick={handleWhatsAppOrder}
            disabled={items.length === 0}
          >
            Confirm via WhatsApp
          </button>

          <button
            className="w-full text-sm text-gray-500"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
