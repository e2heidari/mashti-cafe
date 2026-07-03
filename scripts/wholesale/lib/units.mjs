export const SKU_REGEX = /^[A-Z]{2,4}-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;

const MEASURED_UNITS = new Set(["L", "mL", "kg", "g", "lb"]);

export function formatUnitLabel(unitValue, unitType, unitDisplayOverride) {
  const override = unitDisplayOverride?.trim();
  if (override) {
    return override;
  }

  if (!unitType) {
    return "";
  }

  if (MEASURED_UNITS.has(unitType)) {
    return `${String(unitValue)} ${unitType}`;
  }

  if (unitValue === 1) {
    return unitType;
  }

  return `${unitValue} ${unitType}`;
}

export function normalizeSku(sku) {
  return sku.trim().toUpperCase();
}
