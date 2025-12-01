# SimPro Scheduling Assistant API

## Overview
This is the backend API for the SimPro Scheduling Assistant, a hyper-accurate AI scheduling system that integrates with SimPro to manage technician appointments using real-time availability data.

## Core Functionality
- Find technicians by skill
- Check real-time availability for technicians
- Book appointments with precise scheduling

## API Endpoints

### 1. Find Technician by Skill
```
POST /employees/by-skill
```
**Request Body:**
```json
{
  "skill": "roofing"
}
```

### 2. Check Technician Availability
```
POST /employees/check-availability
```
**Request Body:**
```json
{
  "employeeId": 12,
  "date": "2025-12-04"
}
```
**Response:**
```json
{
  "availability": [
    { "start": "08:00", "end": "11:00" },
    { "start": "13:00", "end": "17:00" }
  ]
}
```

### 3. Book Appointment
```
POST /appointments/book
```
**Request Body:**
```json
{
  "employeeId": 12,
  "date": "2025-12-04",
  "time": "14:00",
  "description": "Roof repair",
  "customerName": "John Doe"
}
```

## Booking Flow

### 1. Initial Greeting
```
Hello! How can I help you today?
```

### 2. Job Description Handling
- Extract skill (e.g., "roofing", "aircon", "plumbing")
- Call `/employees/by-skill`
- Display available technicians

### 3. Technician Selection
- Prompt user for preferred date and time
- Example: "When would you like [Technician Name] to come?"

### 4. Availability Check
- Parse natural language input
- Convert to YYYY-MM-DD and HH:MM (24h)
- Call `/employees/check-availability`

### 5. Booking Logic
- If time is within any availability block → Book immediately
- If time is outside availability → Show available time slots

### 6. Confirmation
After successful booking, display:
```
Perfect! The appointment has been scheduled:
• Date: [date]
• Time: [time]
• Technician: [Technician Name]
```

## Important Rules
- Always use real-time availability from the API
- Never assume general working hours
- Always verify availability before booking
- If time is within an availability block, book it immediately
- Only show "not available" when time is outside the returned availability window

## Error Handling
- If a requested time is not available, show available time slots
- Ensure all API calls are properly handled with appropriate error messages
- Never confirm a booking without a successful API response

