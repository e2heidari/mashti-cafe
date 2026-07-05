import { Card, Flex, Stack, Text } from "@sanity/ui";
import { useMemo } from "react";
import { useFormValue } from "sanity";
import type { StringInputProps } from "sanity";

type FinalizedLineItemDraft = {
  unitPrice?: number;
  finalizedQuantity?: number;
};

function calculatePreviewTotal(items: unknown): number {
  if (!Array.isArray(items) || items.length === 0) {
    return 0;
  }

  const sum = items.reduce((total, item) => {
    const line = item as FinalizedLineItemDraft;
    const unitPrice =
      typeof line.unitPrice === "number" && Number.isFinite(line.unitPrice)
        ? line.unitPrice
        : 0;
    const quantity =
      typeof line.finalizedQuantity === "number" &&
      Number.isFinite(line.finalizedQuantity)
        ? line.finalizedQuantity
        : 0;

    return total + unitPrice * quantity;
  }, 0);

  return Number(sum.toFixed(2));
}

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function FinalizedTotalPreviewInput(_props: StringInputProps) {
  const finalizedItems = useFormValue(["finalizedItems"]);
  const storedTotal = useFormValue(["finalizedTotalAmount"]);

  const calculatedTotal = useMemo(
    () => calculatePreviewTotal(finalizedItems),
    [finalizedItems]
  );

  const lineCount = Array.isArray(finalizedItems) ? finalizedItems.length : 0;
  const storedTotalNumber =
    typeof storedTotal === "number" && Number.isFinite(storedTotal)
      ? storedTotal
      : null;
  const totalsDiffer =
    storedTotalNumber != null &&
    Math.abs(storedTotalNumber - calculatedTotal) > 0.009;

  return (
    <Card padding={4} radius={2} shadow={1} tone="transparent" border>
      <Stack space={3}>
        <Text size={1} weight="semibold">
          Current calculated order total
        </Text>
        <Flex align="center" gap={3}>
          <Text size={4} weight="bold" style={{ color: "#e80812" }}>
            {formatCurrency(calculatedTotal)}
          </Text>
          <Text size={1} muted>
            {lineCount === 1 ? "1 line item" : `${lineCount} line items`}
          </Text>
        </Flex>
        <Text size={1} muted>
          Live preview from finalized quantity and unit price. This does not
          change saved line items.
        </Text>
        {totalsDiffer ? (
          <Text size={1} muted>
            Saved finalized total ({formatCurrency(storedTotalNumber!)}) updates
            when the quote email is sent.
          </Text>
        ) : null}
      </Stack>
    </Card>
  );
}
