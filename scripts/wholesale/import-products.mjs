#!/usr/bin/env node

import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadProjectEnv, readJsonFile } from "./lib/load-env.mjs";
import { parseArgs, resolveFieldPolicy } from "./lib/parse-args.mjs";
import {
  findDuplicateSkusInSanity,
  findProductsWithoutSku,
  validateImportPayload,
} from "./lib/validate-products.mjs";
import {
  createSanityWriteClient,
  fetchExistingProducts,
  indexProductsBySku,
} from "./lib/sanity-client.mjs";
import { applyProductPlan, planProductUpsert } from "./lib/upsert-product.mjs";
import {
  addReportError,
  addReportItem,
  createReport,
  finalizeReport,
  printReport,
  writeJsonReport,
} from "./lib/report.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

async function main() {
  loadProjectEnv(projectRoot);

  const options = parseArgs(process.argv.slice(2));
  const productsPath = path.resolve(projectRoot, options.file);
  const configPath = path.resolve(projectRoot, options.configFile);
  const categoriesPath = path.resolve(
    projectRoot,
    "data/wholesale-products/categories.json"
  );
  const unitTypesPath = path.resolve(
    projectRoot,
    "data/wholesale-products/unit-types.json"
  );
  const imagesDir = path.resolve(projectRoot, "data/wholesale-products/images");

  const payload = readJsonFile(productsPath);
  const config = readJsonFile(configPath);
  const categories = readJsonFile(categoriesPath);
  const unitTypes = readJsonFile(unitTypesPath);
  const fieldPolicy = resolveFieldPolicy(options, config);

  const validation = validateImportPayload(payload, categories, unitTypes);
  const report = createReport();
  report.dryRun = options.dryRun;
  report.fieldPolicy = fieldPolicy;
  report.warnings = validation.warnings.map((warning) => warning.message || warning);

  if (validation.errors.length > 0) {
    for (const error of validation.errors) {
      addReportError(report, error);
    }

    finalizeReport(report);
    printReport(report, { verbose: options.verbose });

    if (options.jsonReport) {
      writeJsonReport(path.resolve(projectRoot, options.jsonReport), report);
    }

    process.exit(1);
  }

  const hasWriteToken = Boolean(process.env.SANITY_API_WRITE_TOKEN?.trim());
  let client = null;
  let existingProducts = [];
  let existingBySku = new Map();

  if (!hasWriteToken) {
    if (options.dryRun) {
      report.warnings.push(
        "SANITY_API_WRITE_TOKEN not set; dry-run will treat all products as CREATE and skip Sanity lookups"
      );
    } else {
      addReportError(report, "Missing SANITY_API_WRITE_TOKEN");
      finalizeReport(report);
      printReport(report, { verbose: options.verbose });
      process.exit(1);
    }
  } else {
    client = createSanityWriteClient();
    existingProducts = await fetchExistingProducts(client);
    existingBySku = indexProductsBySku(existingProducts);
  }

  if (hasWriteToken) {
    const duplicateSkus = findDuplicateSkusInSanity(existingProducts);
    if (duplicateSkus.length > 0) {
      for (const duplicate of duplicateSkus) {
        addReportError(
          report,
          `Duplicate sku in Sanity: ${duplicate.sku} (${duplicate.ids.join(", ")})`
        );
      }

      finalizeReport(report);
      printReport(report, { verbose: options.verbose });
      process.exit(1);
    }

    const missingSkuProducts = findProductsWithoutSku(existingProducts);
    if (missingSkuProducts.length > 0) {
      report.warnings.push(
        `${missingSkuProducts.length} existing product(s) in Sanity have no sku and will not be updated by importer`
      );
    }
  }

  for (const product of validation.products) {
    try {
      const existing = existingBySku.get(product.sku) || null;
      const plan = await planProductUpsert({
        client,
        product,
        existing,
        allowedFields: fieldPolicy.allowedFields,
        imagesDir,
        dryRun: options.dryRun,
        updateImage: options.updateImage,
      });

      if (!options.dryRun && plan.action !== "UNCHANGED") {
        const applied = await applyProductPlan(client, plan);
        addReportItem(report, {
          action: applied.action,
          sku: applied.sku,
          sanityId: applied.sanityId,
          unitLabel: applied.unitLabel,
          changes: applied.changes.map((change) => ({
            field: change.field,
            display: change.display || change.field,
          })),
        });
      } else {
        addReportItem(report, {
          action: plan.action,
          sku: plan.sku,
          sanityId: plan.sanityId,
          unitLabel: plan.unitLabel,
          changes: plan.changes.map((change) => ({
            field: change.field,
            display: change.display || change.field,
          })),
        });
      }
    } catch (error) {
      addReportError(
        report,
        `${product.sku}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  finalizeReport(report);
  printReport(report, { verbose: options.verbose });

  if (options.jsonReport) {
    writeJsonReport(path.resolve(projectRoot, options.jsonReport), report);
  }

  if (report.summary.error > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
