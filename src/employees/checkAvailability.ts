import { simpro } from "../api.js";

const WEEK_MAP: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

function getNextWeekdayDate(dayName: string) {
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = WEEK_MAP[dayName.toLowerCase()];
  let diff = (targetDay - currentDay + 7) % 7;

  if (diff === 0) diff = 7; 

  const result = new Date();
  result.setDate(today.getDate() + diff);
  return result;
}

export async function checkAvailability(
  companyId: number,
  employeeId: number,
  desiredDay: string,
  desiredTime: string
) {
  try {
    const employeeResponse = await simpro.get(
      `/companies/${companyId}/employees/${employeeId}`
    );
    const employee = employeeResponse.data;

    const desiredDate = getNextWeekdayDate(desiredDay);
    const now = new Date();

    const availableSlot = employee.Availability.find((slot: any) => {
      // Match day
      if (slot.StartDate.toLowerCase() !== desiredDay.toLowerCase()) return false;

      // Combine date + time
      const startDateTime = new Date(desiredDate);
      startDateTime.setHours(Number(slot.StartTime.split(":")[0]));
      startDateTime.setMinutes(Number(slot.StartTime.split(":")[1]));

      const endDateTime = new Date(desiredDate);
      endDateTime.setHours(Number(slot.EndTime.split(":")[0]));
      endDateTime.setMinutes(Number(slot.EndTime.split(":")[1]));

      // Check expired
      if (endDateTime < now) return false;

      // Check requested time
      const req = new Date(desiredDate);
      req.setHours(Number(desiredTime.split(":")[0]));
      req.setMinutes(Number(desiredTime.split(":")[1]));

      return req >= startDateTime && req <= endDateTime;
    });

    return availableSlot
      ? { available: true, slot: availableSlot, employee }
      : { available: false, employee };
  } catch (err: any) {
    console.error(
      `Error checking availability for employee ${employeeId}:`,
      err.response?.data || err
    );
    return { available: false, employee: null };
  }
}
