import { Request, Response } from "express";
import { deleteJob } from "../jobs/jobService.js";

export async function cancelAppointment(req: Request, res: Response) {
  const { companyId, jobId } = req.body;

  if (!companyId || !jobId) {
    return res.status(400).json({ error: "Missing required fields: companyId or jobId" });
  }

  try {
    const result = await deleteJob(companyId, jobId);
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Failed to cancel job:", err.response?.data || err);
    res.status(500).json({ error: "Failed to cancel job", details: err.response?.data || err });
  }
}
