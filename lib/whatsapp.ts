import { formatPrice } from "@/lib/utils"

/** Business WhatsApp number, digits only (country code + number), no + or spaces. */
export const WHATSAPP_NUMBER = "96171183481"
export const WHATSAPP_DISPLAY_NUMBER = "+961 71 183 481"

export type WhatsAppLineItem = {
  name: string
  quantity: number
  price: number
}

export type WhatsAppCustomer = {
  name: string
  email?: string
  phone: string
  address: string
  city: string
  country: string
  notes?: string
}

/**
 * Builds a wa.me deep link that opens WhatsApp with a pre-filled order
 * message detailing customer, items, quantities, subtotal, and address.
 */
export function buildWhatsAppOrderLink(
  items: WhatsAppLineItem[], 
  subtotal: number,
  customer?: WhatsAppCustomer
) {
  const lines = [
    "✨ *LUMÉA ESSENTIALS — NEW ORDER REQUEST* ✨",
    "",
    "Hello Luméa team! I would like to place an order:",
    "",
    "*--- ORDERED ITEMS ---*",
    ...items.map((item) => `• *${item.name}* (x${item.quantity}) — ${formatPrice(item.price * item.quantity)}`),
    "",
    `*Subtotal:* ${formatPrice(subtotal)}`,
    `*Shipping:* FREE (Luxury Standard)`,
    `*Total Order Value:* ${formatPrice(subtotal)}`,
    "",
  ]

  if (customer && customer.name) {
    lines.push(
      "*--- CUSTOMER DETAILS ---*",
      `• *Name:* ${customer.name}`,
      `• *Phone:* ${customer.phone}`,
      customer.email ? `• *Email:* ${customer.email}` : "",
      `• *Address:* ${customer.address}`,
      `• *City:* ${customer.city}`,
      `• *Country:* ${customer.country}`,
      customer.notes ? `• *Notes:* ${customer.notes}` : "",
      ""
    )
  }

  lines.push("Please confirm my order availability and delivery timeframe. Thank you!")

  // Filter out any empty lines from clean generation
  const cleanLines = lines.filter((line) => line !== "")

  const message = encodeURIComponent(cleanLines.join("\n"))
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
