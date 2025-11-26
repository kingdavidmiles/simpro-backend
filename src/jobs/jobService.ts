// src/jobs/jobService.ts
import { simpro } from "../api.js";

export interface JobPayload {
  Type: "Project" | "Service" | "Prepaid";
  Site: number;
  Customer?: number;
  Technician?: number;        // Single technician
  Technicians?: number[];     // Optional array of technicians
  Name: string;
  Description?: string;
  DateIssued?: string;        // YYYY-MM-DD
  DueDate?: string;           // YYYY-MM-DD
  DueTime?: string;           // HH:mm
  Stage?: string;             // e.g., "Pending"
}

export async function createJob(companyId: number, jobData: JobPayload) {
  try {
    const res = await simpro.post(`/companies/${companyId}/jobs/`, jobData);
    return res.data;
  } catch (err: any) {
    console.error("Error creating job:", err.response?.data || err);
    throw { error: "Failed to create job", details: err.response?.data || err.message };
  }
}

export async function getJob(companyId: number, jobId: number) {
  const res = await simpro.get(`/companies/${companyId}/jobs/${jobId}`);
  return res.data;
}

export async function updateJob(companyId: number, jobId: number, jobData: Partial<JobPayload>) {
  const res = await simpro.put(`/companies/${companyId}/jobs/${jobId}`, jobData);
  return res.data;
}

export async function patchJob(companyId: number, jobId: number, patchData: Partial<JobPayload>) {
  const res = await simpro.patch(`/companies/${companyId}/jobs/${jobId}`, patchData);
  return res.data;
}

export async function deleteJob(companyId: number, jobId: number) {
  const res = await simpro.delete(`/companies/${companyId}/jobs/${jobId}`);
  return res.data;
}
