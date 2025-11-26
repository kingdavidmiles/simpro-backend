import { simpro } from "../api.js";

interface BookAppointmentParams {
  companyId: number;
  customerName: string;
  siteName: string;
  technicianName: string;
  skill: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  jobName: string;
  description: string;
}

export async function bookAppointment(params: BookAppointmentParams) {
  const { companyId, customerName, siteName, technicianName, date, time, jobName, description } = params;

  try {
    // 1️⃣ Lookup customer
    const customersRes = await simpro.get(`/companies/${companyId}/customers/`);
    const customer = customersRes.data.find((c: any) => c.CompanyName === customerName);
    if (!customer) throw new Error(`Customer "${customerName}" not found`);

    // 2️⃣ Lookup site
    const sitesRes = await simpro.get(`/companies/${companyId}/sites/`);
    const site = sitesRes.data.find((s: any) => s.Name === siteName);
    if (!site) throw new Error(`Site "${siteName}" not found`);

    // 3️⃣ Lookup customer contract
    const contractsRes = await simpro.get(`/companies/${companyId}/customers/${customer.ID}/contracts/`);
    const contract = contractsRes.data[0] || { ID: 0 }; // fallback to first or 0

    // 4️⃣ Lookup contact
    const contactsRes = await simpro.get(`/companies/${companyId}/customers/${customer.ID}/contacts/`);
    const contact = contactsRes.data[0] || { ID: 0 };

    // 5️⃣ Lookup technician
    const employeesRes = await simpro.get(`/companies/${companyId}/employees/`);
    const technician = employeesRes.data.find((e: any) => e.Name === technicianName);
    if (!technician) throw new Error(`Technician "${technicianName}" not found`);

    // 6️⃣ Build job payload
    const jobPayload = {
      Type: "Project",
      Site: site.ID,
      Customer: customer.ID,
      CustomerContract: contract.ID,
      CustomerContact: contact.ID,
      Technician: technician.ID,
      Name: jobName,
      Description: description,
      DateIssued: new Date().toISOString().split("T")[0],
      DueDate: date,
      DueTime: time,
      Stage: "Pending",
    };

    // 7️⃣ Create job
    const res = await simpro.post(`/companies/${companyId}/jobs/`, jobPayload);
    return res.data;
  } catch (err: any) {
    console.error("Failed to create job", err.response?.data || err.message);
    return { error: "Failed to create job", details: err.response?.data || err.message };
  }
}
