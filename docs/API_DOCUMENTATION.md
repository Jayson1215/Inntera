# API Documentation

The Inntera Backend provides a robust REST API for all platform operations. All requests should include the `Accept: application/json` header.

## 🔐 Authentication
- **POST** `/api/auth/login`: Authenticate and receive a Bearer token.
- **POST** `/api/auth/signup`: Register a new guest or staff member.
- **GET** `/api/auth/google/redirect`: Social auth redirection.

## 🏨 Hotels & Rooms
- **GET** `/api/hotels`: List all properties.
- **POST** `/api/hotels`: Create a new hotel (Admin only).
- **GET** `/api/rooms`: Global room inventory matrix.
- **PATCH** `/api/rooms/{id}/status`: Update room turnover state (Staff/Admin).
- **GET** `/api/room-types`: Categorized room data and base rates.

## 📅 Reservations
- **GET** `/api/bookings`: List reservations (filtered by role).
- **POST** `/api/bookings`: Create a new reservation.
- **PATCH** `/api/bookings/{id}/status`: Transition booking lifecycle (confirmed → checked-in).
- **DELETE** `/api/bookings/{id}`: Cancel/Remove reservation.

## 💳 Finance & Payments
- **GET** `/api/payments`: Transaction history.
- **POST** `/api/payments`: Record a new payment (linked to booking).
- **POST** `/api/payments/verify`: Validate user-submitted reference IDs (GCash/Maya).
- **GET** `/api/rates`: Current pricing data.

## 👥 Management
- **GET** `/api/staff`: Staff directory (Admin only).
- **PATCH** `/api/admin/staff/{id}/suspend`: Toggle staff access.
- **GET** `/api/guests`: Guest database.
- **PATCH** `/api/admin/guests/{id}/ban`: Toggle guest access.

## 🔔 System
- **GET** `/api/system/init`: Global data sync for initial load.
- **GET** `/api/notifications`: Retrieve user-specific alerts.
- **PATCH** `/api/notifications/mark-all-read`: Clear notifications.
