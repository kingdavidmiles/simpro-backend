import { simpro } from "../api.js";

export async function findEmployeeCompany(employeeId: number) {
  try {
    // 1. Get all companies
    const companiesResponse = await simpro.get("/companies/");
    const companies = companiesResponse.data; // Adjust if wrapped in Data array

    for (const company of companies) {
      try {
        // 2. Get all employees for this company
        const employeesResponse = await simpro.get(`/companies/${company.ID}/employees/`);
        const employees = employeesResponse.data;

        // 3. Find the employee in this company
        const employee = employees.find((e: any) => e.ID === employeeId);
        if (employee) {
          return { company, employee };
        }
      } catch (err: any) {
        console.log(`Error fetching employees for company ${company.ID}:`, err.response?.data || err);
      }
    }

    return null;
  } catch (err: any) {
    console.error("Error fetching companies:", err.response?.data || err);
    return null;
  }
}
