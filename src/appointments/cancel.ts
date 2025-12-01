// deleteJob.ts
import { simpro } from "../api.js";

export async function cancelAppointment(companyId: number, jobId: number) {
  if (!jobId) throw new Error("Job ID is required");

  try {
    const res = await simpro.delete(
      `/companies/${companyId}/jobs/${jobId}`
    );

    return {
      success: true,
      jobId,
      message: "Job deleted successfully",
      result: res.data,
    };

  } catch (err: any) {
    console.error("Failed to delete job:", err.response?.data || err.message);
    return {
      success: false,
      error: "Failed to delete job",
      details: err.response?.data || err.message,
      status: err.response?.status,
    };
  }
}
