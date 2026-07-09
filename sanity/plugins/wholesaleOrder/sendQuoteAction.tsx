import { useToast } from "@sanity/ui";
import type { DocumentActionComponent } from "sanity";

const BLOCKED_STATUSES = new Set([
  "quote_sent",
  "sending_quote",
  "cancelled",
]);

type WholesaleOrderDoc = {
  status?: string;
  finalEmailSentAt?: string | null;
};

function resolveOrderId(props: {
  id: string;
  published?: { _id: string } | null;
}): string {
  if (props.published?._id) {
    return props.published._id;
  }

  return props.id.replace(/^drafts\./, "");
}

function isSendBlocked(doc: WholesaleOrderDoc | null | undefined): boolean {
  if (!doc) {
    return true;
  }

  if (doc.finalEmailSentAt) {
    return true;
  }

  return BLOCKED_STATUSES.has(doc.status ?? "");
}

function resolveNextAppBaseUrl(): string | null {
  const raw = import.meta.env.SANITY_STUDIO_NEXT_APP_URL;
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.replace(/\/+$/, "");
}

function buildSendQuoteStudioUrl(): string | null {
  const baseUrl = resolveNextAppBaseUrl();
  if (!baseUrl) {
    return null;
  }

  return `${baseUrl}/api/wholesale-order/send-quote-studio`;
}

function blockedReason(doc: WholesaleOrderDoc | null | undefined): string {
  if (!doc) {
    return "Save the order before sending the final order to the customer.";
  }

  if (doc.finalEmailSentAt) {
    return "A quote email has already been sent for this order.";
  }

  switch (doc.status) {
    case "quote_sent":
      return "This order is already marked as final order sent.";
    case "sending_quote":
      return "Sending final order is already in progress.";
    case "cancelled":
      return "Cannot send the final order for a cancelled order.";
    default:
      return "This order cannot be sent in its current state.";
  }
}

export const SendQuoteAction: DocumentActionComponent = (props) => {
  const toast = useToast();
  const doc = (props.draft || props.published) as WholesaleOrderDoc | undefined;
  const blocked = isSendBlocked(doc);

  return {
    label: "Send final order to customer",
    disabled: blocked,
    title: blocked
      ? blockedReason(doc)
      : "Email the finalized order details to the customer.",
    onHandle: () => {
      void (async () => {
        try {
          const sendQuoteUrl = buildSendQuoteStudioUrl();
          if (!sendQuoteUrl) {
            toast.push({
              status: "error",
              title: "Send final order not configured",
              description:
                "Set SANITY_STUDIO_NEXT_APP_URL (e.g. http://localhost:3000) in .env.local and restart Studio.",
            });
            return;
          }

          const orderId = resolveOrderId(props);
          const response = await fetch(sendQuoteUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId }),
          });

          const data = (await response.json()) as {
            success?: boolean;
            message?: string;
            finalEmailSentTo?: string;
          };

          if (response.ok && data.success) {
            toast.push({
              status: "success",
              title: "Quote sent",
              description:
                data.message ||
                (data.finalEmailSentTo
                  ? `Email sent to ${data.finalEmailSentTo}.`
                  : "Quote email sent successfully."),
            });
          } else {
            toast.push({
              status: "error",
              title: "Failed to send quote",
              description: data.message || "The quote email could not be sent.",
            });
          }
        } catch (error) {
          console.error("Send quote action failed:", error);
          toast.push({
            status: "error",
            title: "Failed to send quote",
            description: "An unexpected error occurred while sending the quote.",
          });
        } finally {
          props.onComplete();
        }
      })();
    },
  };
};
