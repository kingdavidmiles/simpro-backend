import { simpro } from "../api.js";

export async function findEmployeesBySkill(skill: string) {
  try {
    const companiesResponse = await simpro.get("/companies/");
    const companies = companiesResponse.data;

    const matchedEmployees: any[] = [];

    for (const company of companies) {
      try {
        // Step 2 — employee list summary
        const employeesResponse = await simpro.get(`/companies/${company.ID}/employees/`);
        const employees = employeesResponse.data;

        for (const emp of employees) {
          try {
            // Step 3 — fetch full employee profile
            const employeeDetail = await simpro.get(
              `/companies/${company.ID}/employees/${emp.ID}`
            );

            const employee = employeeDetail.data;

            // Step 4 — match against cost center name
            const hasSkill = employee.AssignedCostCenters?.some(
              (c: any) =>
                c.Name.toLowerCase().includes(skill.toLowerCase())
            );

            if (hasSkill) {
              matchedEmployees.push({ company, employee });
            }
          } catch (innerErr: any) {
            console.error(
              `Error fetching employee details for ${emp.ID}:`,
              innerErr.response?.data || innerErr
            );
          }
        }
      } catch (err: any) {
        console.log(
          `Error fetching employees for company ${company.ID}:`,
          err.response?.data || err
        );
      }
    }

    return matchedEmployees;
  } catch (err: any) {
    console.error("Error fetching companies:", err.response?.data || err);
    return [];
  }
}
