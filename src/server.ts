// src/server.ts
import express from "express";
import cors from "cors";

// ──────────────────────────────────────────────────────────────
// Employee Services
// ──────────────────────────────────────────────────────────────
import { checkAvailability } from "./employees/checkAvailability.js";
import { findEmployeeById } from "./employees/findEmployeeById.js";
import { findEmployeesBySkill } from "./employees/findEmployeesBySkill.js";

// ──────────────────────────────────────────────────────────────
// Job Services
// ──────────────────────────────────────────────────────────────
import {
  createJob,
  getJob,
  updateJob,
  patchJob,
  deleteJob,
} from "./jobs/jobService.js";
import { cancelAppointment } from "./appointments/cancel.js";
import { rescheduleAppointment } from "./appointments/reschedule.js";
import { bookAppointment, BookAppointmentParams } from "./appointments/book.js";
import { simpro } from "./api.js";

// ──────────────────────────────────────────────────────────────
// App Setup
// ──────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(express.json({ type: "*/*" }));

// Health check
app.get("/", (_req, res) => {
  res.send("SimPro Backend Running");
});

// ──────────────────────────────────────────────────────────────
// Employee Routes
// ──────────────────────────────────────────────────────────────

// Find employee by ID
app.get("/employees/employee/:id", async (req, res) => {
  const employeeId = Number(req.params.id);
  try {
    const result = await findEmployeeById(employeeId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Find employees by skill
app.post("/employees/by-skill", async (req, res) => {
  const { skill } = req.body || {};
  if (!skill) return res.status(400).json({ error: "Missing 'skill' in request body" });

  const result = await findEmployeesBySkill(skill);
  res.json(result);
});

// Check employee availability
app.post("/employees/check-availability", async (req, res) => {
  const { companyId, employeeId, desiredDay, desiredTime } = req.body || {};
  if (!companyId || !employeeId || !desiredDay || !desiredTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const result = await checkAvailability(companyId, employeeId, desiredDay, desiredTime);
  res.json(result);
});

// ──────────────────────────────────────────────────────────────
// Job / Appointment Routes
// ──────────────────────────────────────────────────────────────

// Appointment route
app.post("/appointments/book", async (req, res) => {
  const { Name, Customer, Site, Description, DueDate, DueTime } = req.body;

  // Auto-fill Type as "Service"
  const Type = "Service";

  // Validate required fields
  const missing: string[] = [];
  if (!Name) missing.push("Name");
  if (!Customer) missing.push("Customer");
  if (!Site) missing.push("Site");
  if (!DueDate) missing.push("DueDate");
  if (!DueTime) missing.push("DueTime");

  if (missing.length > 0) {
    return res.status(400).json({ error: "Missing required fields", missing, received: req.body });
  }

  try {
    const response = await simpro.post(`/companies/191/jobs/`, {
      Type,        // always "Service"
      Name,
      Customer,
      Site,
      Description,
      DueDate,
      DueTime,
    });

    res.json({
      success: true,
      jobId: response.data.ID,
      message: "Service Job created successfully",
      job: response.data,
    });
  } catch (err: any) {
    console.error("Failed to book appointment:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      success: false,
      error: "Failed to book appointment",
      details: err.response?.data || err.message,
    });
  }
});


// Cancel a job
app.post("/appointments/cancel", cancelAppointment);

// Reschedule a job
app.post("/appointments/reschedule", rescheduleAppointment);

// ──────────────────────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────────────────────
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});