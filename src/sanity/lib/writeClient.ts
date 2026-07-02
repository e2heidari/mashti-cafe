import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

function getWriteToken(): string {
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!token) {
    throw new Error("Missing environment variable: SANITY_API_WRITE_TOKEN");
  }
  return token;
}

export function getSanityWriteClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token: getWriteToken(),
    useCdn: false,
  });
}
