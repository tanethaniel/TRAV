import { env } from "./env";

// Outbound WhatsApp replies (Cloud API). User-initiated -> inside the 24h service
// window, so no message template needed (docs/INTEGRATIONS.md §6).
export async function sendWhatsApp(to: string, body: string): Promise<void> {
  if (!env.whatsappToken || !env.whatsappPhoneId) {
    console.log(`[whatsapp dev] -> ${to}: ${body}`);
    return;
  }
  await fetch(
    `https://graph.facebook.com/v21.0/${env.whatsappPhoneId}/messages`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.whatsappToken}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body },
      }),
    }
  ).catch((e) => console.error("whatsapp send failed", e));
}
