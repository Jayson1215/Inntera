# 🗄️ Database Schema & Data Architecture

This document provides a comprehensive blueprint of the Inntera relational database, detailing every table, column, relationship, and constraint.

---

## 🗺️ Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ STAFF : profile_for
    USERS ||--o{ GUESTS : profile_for
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

    USERS {
        bigint id PK
        string name
        string email UK
        string password
        enum role "admin, staff, guest"
        soft_deletes deleted_at
    }

    HOTELS {
        bigint id PK
        string display_id UK
        string name
        string address
        string city
        string phone
        string email
        string image_url
        decimal latitude
        decimal longitude
    }

    GUESTS {
        bigint id PK
        string display_id UK
        bigint user_id FK
        string first_name
        string last_name
        string email UK
        string phone
        text address
        string loyalty_member_id
        enum status "active, banned"
    }

    STAFF {
        bigint id PK
        string display_id UK
        bigint user_id FK
        bigint hotel_id FK
        enum position "manager, receptionist, housekeeping, maintenance"
        enum status "active, suspended"
        timestamp hire_date
    }

    ROOM_TYPES {
        bigint room_type_id PK
        bigint hotel_id FK
        string name
        text description
        decimal base_price
        integer max_occupancy
        string image_url
    }

    ROOMS {
        bigint room_id PK
        bigint hotel_id FK
        bigint room_type_id FK
        string room_number
        enum floor
        enum status "available, occupied, housekeeping, maintenance"
        text notes
    }

    BOOKINGS {
        bigint booking_id PK
        string booking_reference UK
        bigint guest_id FK
        bigint hotel_id FK
        date checkin_date
        date checkout_date
        enum booking_status "pending, confirmed, checked-in, checked-out, cancelled"
        decimal total_cost
        text notes
    }

    PAYMENTS {
        bigint payment_id PK
        bigint booking_id FK
        decimal amount
        enum payment_method "credit_card, cash, gcash, maya, bank_transfer"
        enum status "pending, completed, failed"
        string transaction_id
        timestamp payment_date
    }
```

---

## 📁 Detailed Table Definitions

### 🔐 01. Identity & Access
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `users` | The core authentication table for all users. | `id` | - |
| `guests` | Extended profiles for guest-role users. | `id` | `user_id` |
| `staff` | Operational profiles for staff-role users. | `id` | `user_id`, `hotel_id` |

### 🏨 02. Property Management
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `hotels` | Master record of hotel properties. | `id` | - |
| `room_types` | Definitions of room classes and base rates. | `room_type_id` | `hotel_id` |
| `rooms` | Individual physical room units. | `room_id` | `hotel_id`, `room_type_id` |
| `amenities` | Global list of room features. | `amenity_id` | - |
| `room_amenities`| Pivot linking types to amenities. | `id` | `room_type_id`, `amenity_id`|

### 📅 03. Reservation Engine
| Table | Description | Primary Key | Foreign Keys |
| :--- | :--- | :--- | :--- |
| `bookings` | The primary reservation ledger. | `booking_id` | `guest_id`, `hotel_id` |
| `booking_rooms` | Junction table for rooms in a booking. | `id` | `booking_id`, `room_id` |
| `rates` | Time-based pricing overrides. | `rate_id` | `room_type_id` |
| `payments` | Settlement records for bookings. | `payment_id` | `booking_id` |
| `charges` | Incidental costs (Food, Mini-bar). | `charge_id` | `booking_id` |

---

## 🛠️ Data Integrity Rules
- **Soft Deletes**: All major entities (`hotels`, `rooms`, `bookings`, `users`) utilize soft deletes to preserve audit trails.
- **Unique References**: Bookings generate a unique 8-character `booking_reference` for quick lookup in the Staff terminal.
- **Role Enforcement**: Access is strictly partitioned using the `role` column in the `users` table, synced with specific profile records in `staff` or `guests`.

---
<div align="center">
  <p><i>Inntera DB Blueprint v1.5 | Enterprise Schema Documentation</i></p>
</div>
