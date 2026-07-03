const DEFAULT_UPDATE_FIELDS = [
  "name",
  "description",
  "category",
  "ingredients",
  "unitType",
  "unitValue",
  "unitDisplayOverride",
  "order",
  "active",
];

const DEFAULT_SKIP_FIELDS = ["unitPrice", "image"];

export function parseArgs(argv) {
  const options = {
    file: "data/wholesale-products/products.json",
    configFile: "data/wholesale-products/import.config.json",
    dryRun: false,
    verbose: false,
    strict: false,
    jsonReport: null,
    updateFields: null,
    onlyUpdateFields: null,
    skipFields: [],
    syncPrices: false,
    updateImage: false,
    preserveStudioEdits: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    switch (arg) {
      case "--file":
        options.file = argv[index + 1];
        index += 1;
        break;
      case "--config":
        options.configFile = argv[index + 1];
        index += 1;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--verbose":
        options.verbose = true;
        break;
      case "--strict":
        options.strict = true;
        break;
      case "--json-report":
        options.jsonReport = argv[index + 1];
        index += 1;
        break;
      case "--update-fields":
        options.updateFields = argv[index + 1]
          .split(",")
          .map((field) => field.trim())
          .filter(Boolean);
        index += 1;
        break;
      case "--only-update-fields":
        options.onlyUpdateFields = argv[index + 1]
          .split(",")
          .map((field) => field.trim())
          .filter(Boolean);
        index += 1;
        break;
      case "--skip-fields":
        options.skipFields.push(
          ...argv[index + 1]
            .split(",")
            .map((field) => field.trim())
            .filter(Boolean)
        );
        index += 1;
        break;
      case "--sync-prices":
        options.syncPrices = true;
        break;
      case "--update-price":
        options.syncPrices = true;
        break;
      case "--skip-price":
        options.skipFields.push("unitPrice");
        break;
      case "--update-image":
        options.updateImage = true;
        break;
      case "--skip-image":
        options.skipFields.push("image");
        break;
      case "--preserve-studio-edits":
        options.preserveStudioEdits = true;
        break;
      default:
        break;
    }
  }

  return options;
}

export function resolveFieldPolicy(options, config = {}) {
  let allowed = options.onlyUpdateFields
    ? [...options.onlyUpdateFields]
    : options.updateFields
      ? [...options.updateFields]
      : [
          ...(config.defaultUpdateFields || DEFAULT_UPDATE_FIELDS),
        ];

  const skip = new Set([
    ...(config.defaultSkipFields || DEFAULT_SKIP_FIELDS),
    ...options.skipFields,
  ]);

  if (options.preserveStudioEdits) {
    skip.add("unitPrice");
    skip.add("image");
  }

  if (options.syncPrices) {
    skip.delete("unitPrice");
    if (!allowed.includes("unitPrice")) {
      allowed.push("unitPrice");
    }
  }

  if (options.updateImage) {
    skip.delete("image");
    if (!allowed.includes("image")) {
      allowed.push("image");
    }
  }

  allowed = allowed.filter((field) => field !== "sku" && !skip.has(field));

  return {
    allowedFields: allowed,
    skippedFields: Array.from(skip).sort(),
  };
}
