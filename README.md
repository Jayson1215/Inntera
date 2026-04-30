# 🏨 Inntera Hub | Enterprise Hotel OS

<div align="center">
  <img src="https://img.shields.io/badge/Inntera-Hub-emerald?style=for-the-badge&logo=hotel&logoColor=white" />
  <img src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Laravel-10-red?style=for-the-badge&logo=laravel&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql&logoColor=white" />
</div>

---

### 🚀 The Next Generation of Hospitality Management

**Inntera** is a high-performance, enterprise-grade hotel management platform designed to unify multi-property operations. It features a sophisticated **Command Center** aesthetic with real-time state synchronization across Admin, Staff, and Guest portals.

---

## 🏗️ System Architecture

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18 + Vite | High-fidelity SPA & Real-time State |
| **Backend** | Laravel 10 | Stateless RESTful API & Business Logic |
| **Styling** | Tailwind + Custom CSS | Glassmorphism & Fluid Animations |
| **Database** | MySQL 8.0 | Relational Data Persistence |

---

## 🛠️ Installation & Setup

### 📦 Backend Deployment
```bash
# Enter backend directory
cd backend

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Database migration & Seeding
php artisan migrate --seed

# Start API server
php artisan serve
```

### 💻 Frontend Deployment
```bash
# Root directory
npm install

# Start development server
npm run dev
```

---

## 🏢 Platform Hubs

> [!IMPORTANT]
> The system uses a centralized `BookingContext` to ensure that every update in the Admin hub is instantly reflected in the Staff and Guest terminals.

- **👑 Admin Partner Hub**: Monitor global property revenue, manage hotel assets, and orchestrate personnel.
- **⚡ Staff Terminal**: Streamlined check-in/out flow, automated settlement, and real-time housekeeping matrix.
- **✨ Client Portal**: Premium hotel discovery, reservation vault, and integrated E-wallet payment workflows.

---

## 📄 Documentation Vault
Explore our detailed guides for a deeper technical dive:

- [📘 **Platform Features**](file:///c:/Hotel%20Booking%20System/docs/FEATURES.md) — *Detailed breakdown of role-specific capabilities.*
- [📋 **Functionality Matrix**](file:///c:/Hotel%20Booking%20System/docs/FUNCTIONALITIES.md) — *Exhaustive list of all Admin, Staff, and Client features.*
- [💻 **Technical Stack**](file:///c:/Hotel%20Booking%20System/docs/TECH_STACK.md) — *Deep dive into architecture and dependencies.*
- [🗄️ **Database Schema**](file:///c:/Hotel%20Booking%20System/docs/DATABASE_SCHEMA.md) — *Entity relationships and table structures.*
- [🔌 **API Reference**](file:///c:/Hotel%20Booking%20System/docs/API_DOCUMENTATION.md) — *Endpoint mapping and data structures.*
- [📊 **Flow Analysis**](file:///c:/Hotel%20Booking%20System/docs/RESERVATION_FLOW_ANALYSIS.md) — *Internal reservation logic and validation.*

---

<div align="center">
  <p>© 2026 Inntera Hotels Inc. | Enterprise Grade Hospitality</p>
</div>
