export const WHOLESALE_UNIT_TYPES = [
  "L",
  "mL",
  "kg",
  "g",
  "each",
  "cup",
  "box",
  "bag",
  "bottle",
  "can",
  "container",
  "tray",
  "case",
] as const;

export type WholesaleUnitType = (typeof WHOLESALE_UNIT_TYPES)[number];

const MEASURED_UNITS = new Set<WholesaleUnitType>(["L", "mL", "kg", "g"]);

export function isWholesaleUnitType(value: string): value is WholesaleUnitType {
  return (WHOLESALE_UNIT_TYPES as readonly string[]).includes(value);
}

export function formatUnitLabel(
  unitValue: number,
  unitType: string,
  unitDisplayOverride?: string | null
): string {
  const override = unitDisplayOverride?.trim();
  if (override) {
    return override;
  }

  if (!unitType) {
    return "";
  }

  if (MEASURED_UNITS.has(unitType as WholesaleUnitType)) {
    const formattedValue = Number.isInteger(unitValue)
      ? String(unitValue)
      : String(unitValue);
    return `${formattedValue} ${unitType}`;
  }

  if (unitValue === 1) {
    return unitType;
  }

  return `${unitValue} ${unitType}`;
}

export type LegacyWholesaleProductFields = {
  weight?: string;
  price?: number;
  unitType?: string;
  unitValue?: number;
  unitPrice?: number;
  unitDisplayOverride?: string;
};

export function resolveProductUnitFields(product: LegacyWholesaleProductFields) {
  if (product.unitType && typeof product.unitValue === "number") {
    const unitPrice = product.unitPrice ?? product.price ?? 0;
    return {
      unitType: product.unitType,
      unitValue: product.unitValue,
      unitPrice,
      unitDisplayOverride: product.unitDisplayOverride ?? undefined,
      unitLabel: formatUnitLabel(
        product.unitValue,
        product.unitType,
        product.unitDisplayOverride
      ),
    };
  }

  const legacyWeight = product.weight?.trim() || "each";
  const unitPrice = product.unitPrice ?? product.price ?? 0;

  return {
    unitType: "each" as const,
    unitValue: 1,
    unitPrice,
    unitDisplayOverride: legacyWeight,
    unitLabel: legacyWeight,
  };
}
