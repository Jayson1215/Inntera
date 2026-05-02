# 🗄️ Database Schema & Data Architecture

This document provides a comprehensive blueprint of the Inntera relational database, detailing every table, column, relationship, and constraint.

---

## 🗺️ Entity Relationship Diagram

```mermaid
erDiagram
  HOTELS ||--o{ MANAGERS : has
  HOTELS ||--o{ STAFF : employs
  HOTELS ||--o{ ROOM_TYPES : defines
  HOTELS ||--o{ ROOMS : contains
  HOTELS ||--o{ RATES : sets
  HOTELS ||--o{ BOOKINGS : receives
  ROOM_TYPES ||--o{ ROOM_AMENITIES : has
  ROOM_TYPES ||--o{ ROOMS : categorizes
  ROOM_TYPES ||--o{ RATES : priced_by
  AMENITIES ||--o{ ROOM_AMENITIES : included_in
  GUESTS ||--o{ BOOKINGS : makes
  BOOKINGS ||--o{ BOOKING_ROOMS : contains
  BOOKINGS ||--o{ CHARGES : incurs
  BOOKINGS ||--o{ PAYMENTS : paid_via

  HOTELS {
    integer hotel_id PK
    varchar name
    varchar address
    varchar city
    varchar phone
    varchar timezone
    timestamp created_at
  }
  MANAGERS {
    integer manager_id PK
    integer hotel_id FK
    varchar first_name
    varchar last_name
    varchar email
    varchar phone
    varchar role
    timestamp hired_at
  }
  STAFF {
    integer staff_id PK
    integer hotel_id FK
    varchar name
    varchar role
    varchar email
    varchar phone
  }
  ROOM_TYPES {
    integer room_type_id PK
    integer hotel_id FK
    varchar name
    text description
    integer max_occupancy
    decimal base_price
    text amenities_summary
  }
  AMENITIES {
    integer amenity_id PK
    varchar name
    text description
  }
  ROOM_AMENITIES {
    integer room_amenity_id PK
    integer room_type_id FK
    integer amenity_id FK
  }
  ROOMS {
    integer room_id PK
    integer hotel_id FK
    varchar hotel_name
    integer room_type_id FK
    varchar room_number
    varchar floor
    varchar status
    text notes
  }
  RATES {
    integer rate_id PK
    integer hotel_id FK
    integer room_type_id FK
    date start_date
    date end_date
    decimal price
    varchar currency
  }
  GUESTS {
    integer guest_id PK
    varchar first_name
    varchar middle_name
    varchar last_name
    varchar email
    varchar phone
    text address
    varchar loyalty_member_id
    timestamp created_at
  }
  BOOKINGS {
    integer booking_id PK
    integer hotel_id FK
    integer guest_id FK
    varchar guest_name
    varchar booking_reference
    timestamp checkin_date
    timestamp checkout_date
    varchar booking_status
    timestamp created_at
    timestamp modified_at
    text notes
  }
  BOOKING_ROOMS {
    integer booking_room_id PK
    integer booking_id FK
    integer room_id
    integer room_type_id
    decimal rate
    integer adults_count
    integer children_count
    varchar status
    timestamp allocated_at
  }
  CHARGES {
    integer charge_id PK
    integer booking_id FK
    varchar description
    decimal amount
    decimal tax_amount
    timestamp charge_date
  }
  PAYMENTS {
    integer payment_id PK
    integer booking_id FK
    decimal amount
    varchar currency
    varchar payment_method
    varchar status
    varchar transaction_reference
    timestamp paid_at
  }
```

## 📁 Detailed Table Definitions

### 🔐 01. Identity & Access
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `users` | The core authentication table for all users. | `id` | - |
| `guests` | Extended profiles for guest-role users. | `guest_id` | - |
| `managers` | Professional profiles for management staff. | `manager_id` | `hotel_id` |
| `staff` | Operational profiles for staff-role users. | `staff_id` | `hotel_id` |

### 🏨 02. Property Management
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `hotels` | Master record of hotel properties. | `hotel_id` | - |
| `room_types` | Definitions of room classes and base rates. | `room_type_id` | `hotel_id` |
| `rooms` | Individual physical room units. | `room_id` | `hotel_id`, `room_type_id` |
| `amenities` | Global list of room features. | `amenity_id` | - |
| `room_amenities`| Pivot linking types to amenities. | `room_amenity_id` | `room_type_id`, `amenity_id`|

### 📅 03. Reservation Engine
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `bookings` | The primary reservation ledger (includes `guest_name` for optimization). | `booking_id` | `guest_id`, `hotel_id` |
| `booking_rooms` | Junction table for rooms in a booking. | `booking_room_id` | `booking_id`, `room_id` |
| `rates` | Time-based pricing overrides. | `rate_id` | `hotel_id`, `room_type_id` |
| `payments` | Settlement records for bookings. | `payment_id` | `booking_id` |
| `charges` | Incidental costs and fees. | `charge_id` | `booking_id` |

---

## 🛠️ Data Integrity Rules
- **Soft Deletes**: All major entities (`hotels`, `rooms`, `bookings`, `users`) utilize soft deletes to preserve audit trails.
- **Unique References**: Bookings generate a unique 8-character `booking_reference` for quick lookup in the Staff terminal.
- **Role Enforcement**: Access is strictly partitioned using the `role` column in the `users` table, synced with specific profile records in `staff` or `guests`.

---
<div align="center">
  <p><i>Inntera DB Blueprint v1.5 | Enterprise Schema Documentation</i></p>
</div>
