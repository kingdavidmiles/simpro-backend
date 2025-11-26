// book.ts
import { simpro } from "../api.js";

export interface BookAppointmentParams {
  companyId: number;
  customerName: string;
  siteName?: string;
  technicianName: string;
  costCentre?: string;
  skill?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  jobName: string;
  description?: string;
}

export async function bookAppointment(params: BookAppointmentParams) {
  const {
    companyId,
    customerName,
    siteName,
    technicianName,
    costCentre,
    skill,
    date,
    time,
    jobName,
    description = "",
  } = params;

  // Validate date/time
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Invalid date format: ${date}`);
  if (!/^\d{2}:\d{2}$/.test(time)) throw new Error(`Invalid time format: ${time}`);

  try {
    // 1️⃣ Lookup Customer
    const customersRes = await simpro.get(`/companies/${companyId}/customers/`);
    const customer = customersRes.data.find((c: any) => c.CompanyName?.trim() === customerName.trim());
    if (!customer) throw new Error(`Customer "${customerName}" not found`);

    // 2️⃣ Lookup Site
    let siteId: number;
    if (siteName) {
      const sitesRes = await simpro.get(`/companies/${companyId}/sites/`);
      const site = sitesRes.data.find((s: any) => s.Name?.trim() === siteName.trim());
      if (!site) throw new Error(`Site "${siteName}" not found`);
      siteId = site.ID;
    } else {
      const customerSitesRes = await simpro.get(`/companies/${companyId}/customers/${customer.ID}/sites/`);
      const primarySite = customerSitesRes.data[0];
      if (!primarySite) throw new Error(`No site found for customer "${customerName}"`);
      siteId = primarySite.ID;
    }

    // 3️⃣ Lookup Technician (optional for payload, but we can log/check)
    const employeesRes = await simpro.get(`/companies/${companyId}/employees/`);
    const technician = employeesRes.data.find((e: any) => e.Name?.trim() === technicianName.trim());
    if (!technician) throw new Error(`Technician "${technicianName}" not found`);

    // 4️⃣ Lookup Cost Centre (optional)
    let costCentreId: number | undefined;
    if (costCentre) {
      const ccRes = await simpro.get(`/companies/${companyId}/costcentres/`);
      const cc = ccRes.data.find((c: any) => c.Name?.trim() === costCentre.trim());
      if (cc) costCentreId = cc.ID;
    }

    // 5️⃣ Build payload exactly like Postman working example
    const payload: any = {
      Type: "Service",           // mandatory
      Name: jobName,
      Customer: customer.ID,    // integer
      Site: siteId,             // integer
      Description: skill ? `${description}\nSkill: ${skill}` : description,
      DueDate: date,
      DueTime: time,
      Stage: "Pending",
      AutoAdjustStatus: false,
    };

    if (costCentreId) payload.CostCentre = costCentreId;

    console.log("Creating Service Job with payload:", JSON.stringify(payload, null, 2));

    // 6️⃣ POST to working endpoint
    const res = await simpro.post(`/companies/${companyId}/jobs/`, payload);

    return {
      success: true,
      jobId: res.data.ID,
      message: "Service Job created successfully",
      job: res.data,
    };

  } catch (err: any) {
    console.error("Failed to book appointment:", err.response?.data || err.message);
    return {
      success: false,
      error: "Failed to book appointment",
      details: err.response?.data || err.message,
      status: err.response?.status,
    };
  }
}
