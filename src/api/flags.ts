import { post } from "./client";
import type { Flag, FlagCreateInput, FlagUpdateInput } from "../types";

interface WebsiteWithOrg {
  id: string;
  organizationId: string;
}

export async function fetchOrganizationId(): Promise<string> {
  const websites = await post<WebsiteWithOrg[]>("/websites/list", {});
  const orgId = websites?.[0]?.organizationId;
  if (!orgId) throw new Error("No organization found. Make sure you have at least one website.");
  return orgId;
}

export async function fetchFlags(organizationId: string): Promise<Flag[]> {
  if (!organizationId) return [];
  return post<Flag[]>("/flags/list", { organizationId });
}

export async function fetchFlag(id: string): Promise<Flag> {
  if (!id) throw new Error("Flag ID is required");
  return post<Flag>("/flags/getById", { id });
}

export async function createFlag(organizationId: string, data: FlagCreateInput): Promise<Flag> {
  return post<Flag>("/flags/create", { organizationId, ...data } as unknown as Record<string, unknown>);
}

export async function updateFlag(id: string, data: FlagUpdateInput): Promise<Flag> {
  if (!id) throw new Error("Flag ID is required");
  return post<Flag>("/flags/update", { id, ...data });
}

export async function deleteFlag(id: string): Promise<void> {
  if (!id) throw new Error("Flag ID is required");
  await post<{ success: true }>("/flags/delete", { id });
}

export async function toggleFlagStatus(id: string, status: "active" | "inactive"): Promise<Flag> {
  if (!id) throw new Error("Flag ID is required");
  return post<Flag>("/flags/update", { id, status });
}
