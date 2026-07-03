import fs from "node:fs";
import path from "node:path";

export function createReport() {
  return {
    startedAt: new Date().toISOString(),
    finishedAt: null,
    dryRun: false,
    summary: {
      total: 0,
      create: 0,
      update: 0,
      unchanged: 0,
      error: 0,
    },
    warnings: [],
    items: [],
    errors: [],
  };
}

export function addReportItem(report, item) {
  report.items.push(item);
  report.summary.total += 1;
  report.summary[item.action.toLowerCase()] =
    (report.summary[item.action.toLowerCase()] || 0) + 1;
}

export function addReportError(report, error) {
  report.errors.push(error);
  report.summary.error += 1;
}

export function finalizeReport(report) {
  report.finishedAt = new Date().toISOString();
  return report;
}

export function printReport(report, { verbose = false } = {}) {
  console.log("");
  console.log("Wholesale Product Import Report");
  console.log("================================");
  console.log(`Mode: ${report.dryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`Total: ${report.summary.total}`);
  console.log(`Create: ${report.summary.create}`);
  console.log(`Update: ${report.summary.update}`);
  console.log(`Unchanged: ${report.summary.unchanged}`);
  console.log(`Errors: ${report.summary.error}`);

  if (report.warnings.length > 0) {
    console.log("");
    console.log("Warnings:");
    for (const warning of report.warnings) {
      console.log(`- ${warning.message || warning}`);
    }
  }

  if (verbose) {
    console.log("");
    for (const item of report.items) {
      console.log(`[${item.action}] ${item.sku}${item.sanityId ? ` (${item.sanityId})` : ""}`);
      for (const change of item.changes || []) {
        console.log(`  - ${change.display || change.field}`);
      }
    }
  } else {
    const changed = report.items.filter((item) => item.action !== "UNCHANGED");
    if (changed.length > 0) {
      console.log("");
      for (const item of changed) {
        console.log(`[${item.action}] ${item.sku}`);
        for (const change of item.changes || []) {
          console.log(`  - ${change.display || change.field}`);
        }
      }
    }
  }

  if (report.errors.length > 0) {
    console.log("");
    console.log("Errors:");
    for (const error of report.errors) {
      console.log(`- ${error}`);
    }
  }
}

export function writeJsonReport(reportPath, report) {
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
}
