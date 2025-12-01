// updateJob.ts
import { simpro } from "../api.js";

export interface UpdateJobParams {
  companyId: number;
  jobId: number;
  Name?: string;
  Description?: string;
  DueDate?: string; // YYYY-MM-DD
  DueTime?: string; // HH:MM
  Stage?: string;
}

export async function rescheduleAppointment(params: UpdateJobParams) {
  const { companyId, jobId, ...updates } = params;

  if (Object.keys(updates).length === 0) {
    throw new Error("No update fields provided.");
  }

  try {
    console.log("Updating job:", jobId, updates);

    const res = await simpro.patch(
      `/companies/${companyId}/jobs/${jobId}`, 
      updates
    );

    return {
      success: true,
      jobId,
      updated: res.data,
      message: "Job updated successfully",
    };

  } catch (err: any) {
    console.error("Failed to update job:", err.response?.data || err.message);
    return {
      success: false,
      error: "Failed to update job",
      details: err.response?.data || err.message,
      status: err.response?.status,
    };
  }
}
