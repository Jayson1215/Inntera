# Hotel Booking System - Enterprise Platform

A comprehensive hotel booking management system built with Next.js 14, MySQL, and TypeScript. Features include customer bookings, admin management, and staff operations.

## Features

### 🏨 Core Features
- **Multi-Hotel Support**: Manage multiple hotels from a single system
- **Dynamic Pricing**: Set rates by date range
- **Room Management**: Track room inventory and status
- **Booking System**: Complete booking lifecycle from pending to checked-out
- **Payment Processing**: Record payments and charges
- **Guest Management**: Maintain guest profiles and loyalty tracking

### 👥 Role-Based Access
- **Admin**: Full system access (hotels, rooms, bookings, rates, staff)
- **Manager**: Hotel-level management
- **Staff**: Front-desk operations (check-in, check-out, rooms)
- **Guest**: Make and manage bookings

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: MySQL 8.0+
- **Authentication**: NextAuth.js v5
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **ORM/Query**: Raw SQL with mysql2/promise

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/          # Authentication handlers
│   │   ├── hotels/                       # Hotel CRUD API
│   │   ├── bookings/                     # Booking API
│   │   ├── rooms/                        # Room API
│   │   ├── room-types/                   # Room type API
│   │   ├── rates/                        # Rate API
│   │   ├── guests/                       # Guest API
│   │   ├── charges/                      # Charge API
│   │   └── payments/                     # Payment API
│   ├── (admin)/dashboard/                # Admin portal
│   ├── (staff)/dashboard/                # Staff portal
│   ├── (customer)/
│   │   ├── search/                       # Hotel search
│   │   ├── booking/                      # Booking form
│   │   └── confirmation/                 # Booking confirmation
│   ├── components/
│   │   ├── ui/                           # shadcn/ui components
│   │   └── navigation.tsx
│   ├── lib/
│   │   ├── db.ts                         # MySQL connection pool
│   │   ├── auth.ts                       # NextAuth configuration
│   │   ├── utils.ts                      # Utility functions
│   │   ├── repositories/                 # Data access layer
│   │   └── services/                     # Business logic
│   ├── styles/                           # Global CSS
│   ├── types/                            # TypeScript interfaces
│   ├── validations/                      # Zod schemas
│   ├── layout.tsx                        # Root layout
│   └── page.tsx                          # Home page
├── middleware.ts                          # Route protection
├── database/
│   └── schema.sql                         # Database schema
├── .env.example                           # Environment variables template
├── next.config.js                         # Next.js configuration
├── tailwind.config.ts                     # Tailwind configuration
├── tsconfig.json                          # TypeScript configuration
└── package.json                           # Dependencies

```

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ and npm/yarn
- MySQL 8.0+ server running
- phpMyAdmin or MySQL client tool

### 2. Environment Setup

Create a `.env.local` file in the project root:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hotel_booking_system

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-min-32-chars-very-secure-string
NEXTAUTH_URL=http://localhost:3000

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

1. Create MySQL database:
```bash
mysql -u root -p
CREATE DATABASE hotel_booking_system;
USE hotel_booking_system;
```

2. Import schema:
```bash
mysql -u root -p hotel_booking_system < database/schema.sql
```

Or run SQL manually in phpMyAdmin:
- Open `database/schema.sql`
- Execute in phpMyAdmin

### 4. Install Dependencies

```bash
npm install
# or
yarn install
```

### 5. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

| Role | Email | Password | Access |
|------|-------|----------|--------|
| Admin | admin@hotel.com | admin123 | Full system access |
| Manager | manager@hotel.com | manager123 | Hotel management |
| Staff | staff@hotel.com | staff123 | Daily operations |
| Guest | guest@example.com | guest123 | Make bookings |

## API Routes

### Hotels
- `GET /api/hotels` - List all hotels
- `POST /api/hotels` - Create hotel (Admin only)

### Room Types
- `GET /api/room-types` - List room types
- `POST /api/room-types` - Create room type (Admin/Manager)

### Rooms
- `GET /api/rooms` - List rooms
- `POST /api/rooms` - Create room (Admin/Manager)

### Bookings
- `GET /api/bookings` - List bookings
- `POST /api/bookings` - Create booking

### Rates
- `GET /api/rates` - List rates
- `POST /api/rates` - Create rate (Admin/Manager)

### Guests
- `GET /api/guests` - List guests (Admin/Manager)
- `POST /api/guests` - Create guest

### Charges
- `GET /api/charges?bookingId=1` - Get booking charges
- `POST /api/charges` - Create charge (Admin/Manager/Staff)

### Payments
- `GET /api/payments?bookingId=1` - Get booking payments
- `POST /api/payments` - Process payment

## Database Schema

### Hotels
Stores hotel properties with location and contact info.

### Room Types
Room categories (Standard, Deluxe, Suite) with occupancy and pricing.

### Rooms
Individual rooms linked to room types with status tracking.

### Rates
Dynamic pricing rules by date range and room type.

### Guests
Guest profiles with loyalty tracking.

### Bookings
Booking records with complete lifecycle status.

### Booking Rooms
Junction table linking bookings to allocated rooms.

### Charges
Itemized charges (room, services, taxes) per booking.

### Payments
Payment records and transaction tracking.

## Authentication Flow

1. User signs in with email/password
2. NextAuth verifies credentials (demo or database)
3. Session token is created
4. User is redirected based on role:
   - Admin → `/admin/dashboard`
   - Manager/Staff → `/staff/dashboard`
   - Guest → `/customer/search`

## Booking Flow

1. Guest searches hotels by date and guests
2. Guest selects room type from results
3. Guest fills booking form (name, email, phone)
4. System checks room availability
5. Booking is created with "pending" status
6. Charges are automatically calculated
7. Confirmation page displays booking reference

## Production Deployment

### Build
```bash
npm run build
npm start
```

### Environment Setup
- Set `NEXTAUTH_URL` to production domain
- Use a strong `NEXTAUTH_SECRET` (32+ characters)
- Point `DB_*` variables to production MySQL server
- Set `NODE_ENV=production`

### Database
- Use managed MySQL service (AWS RDS, DigitalOcean, etc.)
- Enable SSL connections
- Set up regular backups
- Create database user with limited privileges

### Security Checklist
- [ ] Change all NEXTAUTH_SECRET
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS only
- [ ] Set up rate limiting on API routes
- [ ] Implement CORS properly
- [ ] Use prepared statements (already done)
- [ ] Enable SQL query logging
- [ ] Regular security audits

## Development Tips

### Adding New Endpoints
1. Create Zod validation schema in `app/validations/index.ts`
2. Add repository method in `app/lib/repositories/`
3. Create API route in `app/api/`
4. Use service layer for business logic

### Adding New Pages
1. Create page component in appropriate layout directory
2. Use `useSession()` for auth checks (client components)
3. Use `auth()` server function for server components
4. Apply role-based access control

### Database Queries
All queries use parameterized statements:
```typescript
const [rows] = await connection.query(
  'SELECT * FROM users WHERE email = ?',
  [email] // Safety from SQL injection
);
```

## Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DB credentials in .env.local
- Ensure database exists: `CREATE DATABASE hotel_booking_system;`

### Authentication Issues
- Clear browser cookies
- Check NEXTAUTH_SECRET is set and consistent
- Verify credentials match demo accounts

### API Errors
- Check browser console for error messages
- Review server logs: `npm run dev`
- Verify request body matches schema
- Check user role has permission

## Contributing

1. Create feature branch
2. Make changes following code style
3. Test thoroughly
4. Submit pull request

## License

MIT License - feel free to use this project for learning and commercial purposes.

## Support

For issues or questions:
1. Check existing documentation
2. Review schema.sql for data structure
3. Check demo accounts for testing
4. Review API routes for endpoints

---

**Happy Coding! 🚀**
