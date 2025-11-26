// src/jobs/fetchIds.ts
import { simpro } from "../api.js";

export async function resolveJobIds(
  companyId: number,
  customerName: string,
  siteName: string
) {
  // 1. Find customer by name
  const customersRes = await simpro.get(`/companies/${companyId}/customers/`);
  const customer = customersRes.data.find((c: any) =>
    c.CompanyName.toLowerCase().includes(customerName.toLowerCase())
  );

  if (!customer) throw new Error(`Customer "${customerName}" not found`);

  // 2. Find site by name
  const sitesRes = await simpro.get(`/companies/${companyId}/sites/`);
  const site = sitesRes.data.find((s: any) =>
    s.Name.toLowerCase().includes(siteName.toLowerCase())
  );

  if (!site) throw new Error(`Site "${siteName}" not found`);

  // 3. Use the first contract and first contact if they exist
  const contractId = customer.Contracts?.[0]?.ID ?? 0;
  const contactId = customer.Contacts?.[0]?.ID ?? 0;

  return {
    customerId: customer.ID,
    customerContractId: contractId,
    customerContactId: contactId,
    siteId: site.ID
  };
}
