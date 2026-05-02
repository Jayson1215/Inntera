# Full Technical Stack Documentation: Inntera

This document provides an exhaustive overview of the technical architecture, design patterns, and dependency choices that power the Inntera Hotel Booking System.

---

## 1. Core Architecture
Inntera follows a **decoupled Client-Server architecture**, separating the high-fidelity user interface from the business logic and persistence layer.

- **Frontend**: Single Page Application (SPA) optimized for speed and interactivity.
- **Backend**: RESTful API acting as a stateless data orchestrator.
- **Communication**: JSON-based communication over HTTP/S with custom middleware for role-based access.

---

## 2. Frontend Ecosystem (React)

### Framework & Tooling
- **React 18**: Chosen for its concurrent rendering capabilities and robust ecosystem.
- **Vite**: Used for lightning-fast HMR (Hot Module Replacement) and optimized production builds.
- **TypeScript**: Ensures type safety across components, especially for complex reservation and payment objects.

### Design & Styling
- **Tailwind CSS**: Used for rapid layout prototyping and consistent spacing/sizing.
- **Custom CSS Engine**:
    - **Glassmorphism**: Advanced `backdrop-filter` effects for the "Command Center" aesthetic.
    - **Fluid Animations**: CSS keyframes and transitions for sidebar toggles and modal entry/exit.
- **Lucide React**: Vector icons selected for their clarity and low bundle size.

### State Orchestration
- **Context API**: 
    - `AuthContext`: Manages user identity, JWT tokens, and secure redirection.
    - `BookingContext`: A global "Source of Truth" that syncs Hotels, Rooms, Bookings, and Staff data. It implements a custom sync logic to provide instant UI updates.
- **React Router Dom v6**: Handles complex nested routing for the Admin, Staff, and Client terminals.

### Specialized Libraries
- **Radix UI**: Provides the accessible primitives for Modals (Dialog), Sidebars (Sheet), and Menus.
- **Sonner**: High-performance toast notifications for system feedback.
- **html2canvas / jsPDF**: Client-side logic for generating and downloading dynamic PDF receipts.
- **PayMongo SDK/API**: Integrated for processing digital payments via GCash, Maya, and GrabPay.

---

## 4. Developer Tools & Standards

### CLI Infrastructure
- **@jayson1215/skills**: A custom-built CLI tool (accessible via `npx Jayson1215/skills`) that enforces project-wide AI coding standards, UI/UX aesthetics, and architectural rules through a generated `.cursorrules` file.

### Design Standards
- **SaaS-Grade UI**: Strictly follows a "premium" aesthetic featuring high-contrast color palettes (Emerald/Slate/Black), glassmorphism, and dynamic interactive button states.
- **Status Consistency**: Enforces hyphenated status strings (e.g., `checked-in`, `checked-out`) across both frontend and backend systems.

---

## 5. Backend Ecosystem (Laravel)

### Engine & API
- **Laravel 10**: The primary engine for data persistence and business logic.
- **Laravel Sanctum**: Provides lightweight token-based authentication for the SPA.
- **MySQL 8.0**: The relational database used for storing multi-property data with foreign key constraints ensuring referential integrity.

### Patterns & Structure
- **Controller-Service Pattern**: Controllers handle HTTP requests while Service classes contain the core business logic (e.g., calculating booking costs).
- **Eloquent ORM**: Used for elegant database interactions and model relationship management.
- **Resource Collections**: Ensures that API responses are consistent and strictly typed before reaching the frontend.

---

## 4. Directory Structure

### Root (Frontend)
- `/src/app`: Main application logic.
- `/src/app/components`: Reusable UI primitives (Buttons, Inputs, Cards).
- `/src/app/context`: State providers (`AuthContext`, `BookingContext`).
- `/src/app/layouts`: Layout wrappers for different user roles.
- `/src/app/pages`: Role-specific view components (Admin, Staff, Client).
- `/src/app/lib`: Utilities like the `apiFetch` wrapper and `utils.ts`.

### /backend (Laravel)
- `/app/Http/Controllers`: Endpoint handlers.
- `/app/Models`: Database schemas.
- `/database/migrations`: Version-controlled database schema changes.
- `/routes/api.php`: API endpoint definitions.

---

## 5. Security & Performance
- **Role-Based Access Control (RBAC)**: Enforced both at the API level (Laravel Middleware) and UI level (React Guards).
- **Environment Safety**: Sensitive keys (API URLs, Database credentials) are managed via `.env` files.
- **Vite Proxy**: Prevents CORS issues during development by proxying `/api` requests to the Laravel server.
- **Optimistic UI**: The system updates local state immediately while syncing in the background to feel instantaneous.
