import { simpro } from "../api.js";

export async function findEmployeeById(employeeId: number) {
  try {
    const companiesResponse = await simpro.get("/companies/");
    const companies = companiesResponse.data;

    for (const company of companies) {
      try {
        const employeesResponse = await simpro.get(`/companies/${company.ID}/employees/`);
        const employees = employeesResponse.data;

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
