import { Request, Response } from "express";
import { patchJob } from "../jobs/jobService.js";

export async function rescheduleAppointment(req: Request, res: Response) {
  const { companyId, jobId, newDueDate, newDueTime } = req.body;

  if (!companyId || !jobId || !newDueDate || !newDueTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const patchData = {
    DueDate: newDueDate,
    DueTime: newDueTime
  };

  try {
    const result = await patchJob(companyId, jobId, patchData);
    res.json({ success: true, result });
  } catch (err: any) {
    console.error("Failed to reschedule job:", err.response?.data || err);
    res.status(500).json({ error: "Failed to reschedule job", details: err.response?.data || err });
  }
}
