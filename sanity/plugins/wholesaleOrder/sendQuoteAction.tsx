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

function blockedReason(doc: WholesaleOrderDoc | null | undefined): string {
  if (!doc) {
    return "Save the order before sending a quote.";
  }

  if (doc.finalEmailSentAt) {
    return "A quote email has already been sent for this order.";
  }

  switch (doc.status) {
    case "quote_sent":
      return "This order is already marked as quote sent.";
    case "sending_quote":
      return "A quote send is already in progress.";
    case "cancelled":
      return "Cannot send a quote for a cancelled order.";
    default:
      return "This order cannot be sent in its current state.";
  }
}

export const SendQuoteAction: DocumentActionComponent = (props) => {
  const toast = useToast();
  const doc = (props.draft || props.published) as WholesaleOrderDoc | undefined;
  const blocked = isSendBlocked(doc);

  return {
    label: "Send quote to customer",
    disabled: blocked,
    title: blocked
      ? blockedReason(doc)
      : "Email the finalized quote to the customer.",
    onHandle: () => {
      void (async () => {
        try {
          const orderId = resolveOrderId(props);
          const response = await fetch("/api/wholesale-order/send-quote-studio", {
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
