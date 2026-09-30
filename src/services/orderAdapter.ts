import { OrderApiConfig, OrderSubmission } from "../types/store";

/**
 * Transforms an internal order submission into the payload structure required by the target Order API
 */
export function buildExternalOrderPayload(
  submission: OrderSubmission,
  config: OrderApiConfig,
  orderNumber: number,
  orderId: string,
): any {
  const timestamp = new Date().toISOString();

  switch (config.payloadFormat) {
    case "shopify_like":
      return {
        order: {
          reference: orderId,
          order_number: orderNumber,
          created_at: timestamp,
          email: submission.customer.email,
          phone: submission.customer.phone,
          currency: submission.currency,
          subtotal_price: submission.subtotal,
          total_price: submission.totalAmount,
          total_shipping: submission.deliveryFee,
          financial_status:
            submission.customer.paymentMethod === "cash_on_delivery"
              ? "pending"
              : "paid",
          customer: {
            first_name: submission.customer.fullName.split(" ")[0] || "",
            last_name:
              submission.customer.fullName.split(" ").slice(1).join(" ") || "",
            email: submission.customer.email,
            phone: submission.customer.phone,
          },
          shipping_address: {
            name: submission.customer.fullName,
            address1: submission.customer.deliveryAddress,
            city: submission.customer.city,
            country: "Nigeria",
          },
          line_items: submission.items.map((item) => ({
            product_id: item.productId,
            title: item.name,
            quantity: item.quantity,
            price: item.unitPrice,
            total: item.subtotal,
            category: item.category,
          })),
          note: submission.notes || submission.customer.notes || "",
        },
      };

    case "minimal":
      return {
        order_id: orderId,
        customer_email: submission.customer.email,
        customer_phone: submission.customer.phone,
        total_amount: submission.totalAmount,
        currency: submission.currency,
        items: submission.items.map((item) => ({
          id: item.productId,
          qty: item.quantity,
          unit_price: item.unitPrice,
        })),
        destination: `${submission.customer.deliveryAddress}, ${submission.customer.city}`,
        payment_method: submission.customer.paymentMethod,
      };

    case "standard":
    default:
      return {
        order_metadata: {
          id: orderId,
          number: orderNumber,
          created_at: timestamp,
          source: "winlium microsite",
          version: "1.0.0",
        },
        customer: {
          full_name: submission.customer.fullName,
          email: submission.customer.email,
          phone: submission.customer.phone,
          address: submission.customer.deliveryAddress,
          city: submission.customer.city,
          notes: submission.customer.notes || "",
        },
        items: submission.items.map((item) => ({
          product_id: item.productId,
          product_name: item.name,
          category: item.category || "General",
          unit_price: item.unitPrice,
          quantity: item.quantity,
          line_total: item.subtotal,
        })),
        pricing: {
          subtotal: submission.subtotal,
          delivery_fee: submission.deliveryFee,
          total: submission.totalAmount,
          currency: submission.currency,
        },
        payment: {
          method: submission.customer.paymentMethod,
          status:
            submission.customer.paymentMethod === "cash_on_delivery"
              ? "payment_on_delivery"
              : "authorized",
        },
      };
  }
}
