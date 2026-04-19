# Masstrans Alerts Dashboard

This document outlines the approach for building the Fleet Alerts Dashboard using Next.js, matching the beautiful vibrant aesthetics of the provided reference image, and specifically addressing the requirements for vehicle alert tracking.

## User Review Required

> [!IMPORTANT]
> Please review the proposed plan below. Let me know if the data points (types of alerts) or the specific interactions match your expectations before I begin setting up the codebase. Since we are using Vanilla CSS instead of Tailwind (as per guidelines unless requested otherwise), the setup will leverage standard CSS modules.

## Proposed Changes

### Setup & Architecture
- **Framework:** Next.js (App Router).
- **Styling:** Vanilla CSS (CSS Modules) to replicate the rich, vibrant gradient backgrounds, glassmorphic elements, and sleek white cards shown in the mockup.
- **Charts/Icons:** We will use `recharts` for any graphical data representation (like the overall view) and `lucide-react` for clean, modern icons.

---

### Components & Layout

#### 1. Global Layout
- **Sidebar:** Left navigation pane with items like "Dashboard", "Vehicle Management", "Alerts", "Tracking".
- **Top Navbar:** Search bar, last update indicator, notification bell, and user profile snippet.

#### 2. The Dashboard (Alerts View)
- **Filter Controls:** A dedicated section at the top of the dashboard containing interactive inputs for **Vehicle Number** (e.g., text or dropdown) and **Journey Date** (date picker).
- **Overall View (Aggregated Alerts):** 
  - Upon selecting a vehicle and date, this section will display summary cards similar to the circular progress indicators in the mockup.
  - Metrics will include: `Total Alerts`, `Overspeeding`, `Harsh Braking`, `Idling`, `Geofence Violations`.
- **Vehicle Wise Alerts (Detailed Records):**
  - A modern data table or a list of interactive cards displaying individual alert records.
  - Columns/Details: Alert Time, Alert Type, Severity, Location, and Status.

---

## Open Questions

> [!WARNING]
> 1. Do you have a specific backend API structure in NestJS planned yet, or should I mock the data for now?
> 2. Are there any specific chart libraries you prefer (e.g. Chart.js, Recharts), or is Recharts fine?
> 3. Should the "Overall View" and "Vehicle Wise Alerts" be on the same page, or separated into two distinct tabs/routes?

## Verification Plan

### Manual Verification
- After setting up the UI, I will spawn the Next.js development server.
- I will mock some vehicle and alert data.
- I will verify that filtering by vehicle number and date accurately updates both the summary section and the detailed alert records section.
- I will compare the aesthetics against the provided design to ensure premium quality.
