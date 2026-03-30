# Quick Start Guide

## 1-Minute Setup

### Step 1: Install & Configure
```bash
npm install
cp .env.example .env.local
# Edit .env.local with your MySQL credentials
```

### Step 2: Create Database
```bash
# Via MySQL CLI or phpMyAdmin, run:
# From database/schema.sql
```

### Step 3: Run
```bash
npm run dev
```

Open http://localhost:3000 ✅

## Login Quickly

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@hotel.com | admin123 |
| Manager | manager@hotel.com | manager123 |
| Staff | staff@hotel.com | staff123 |
| Guest | guest@example.com | guest123 |

## Key Features

### For Guests
- 🔍 Search hotels by date
- 💳 Make bookings
- 📋 View booking confirmation
- 🔖 Get booking reference

### For Staff
- ✅ Check-in guests
- 🔑 Check-out guests
- 🧹 Update room status
- 📅 View daily schedule

### For Managers
- 🏨 Manage hotels
- 🛏️ Create room types
- 💰 Set dynamic pricing
- 📊 View reports

### For Admins
- 👥 Full system access
- 📈 Analytics
- 👔 Staff management
- ⚙️ System configuration

## Project Contents

```
API Routes: /api (hotels, rooms, bookings, rates, payments)
Customer Pages: /customer (search, booking, confirmation)
Staff Portal: /staff/dashboard
Admin Portal: /admin/dashboard
Database: /database/schema.sql
Docs: SETUP.md (full guide)
```

## Database Schema

14 tables covering:
- Hotels & properties
- Rooms & room types
- Guests & bookings
- Rates & pricing
- Payments & charges
- Staff & managers

See SETUP.md for full schema details.

## Next Steps

1. **Set up database** (SETUP.md Step 3)
2. **Configure .env.local** with MySQL details
3. **Run dev server** and test with demo accounts
4. **Explore portals** - try different user roles
5. **Check API routes** - test endpoints with Postman

## Common Tasks

### Add a new hotel
1. Admin dashboard → Hotels
2. Create new hotel
3. Add room types, rooms, rates

### Make a booking
1. Search hotels
2. Select room type
3. Fill guest info
4. Confirm

### Check in a guest
1. Staff dashboard → Check-in
2. Search booking reference
3. Select room
4. Mark as checked in

## Troubleshooting

**"Can't connect to MySQL"**
- Check MySQL is running
- Verify credentials in .env.local
- Ensure database exists

**"Database not found"**
- Import schema.sql to create tables
- Use phpMyAdmin to execute SQL

**"Authentication error"**
- Clear cookies
- Check demo credentials above
- Verify NEXTAUTH_SECRET is set

## Support Files

- `SETUP.md` - Full setup guide
- `database/schema.sql` - Database structure
- `.env.example` - Environment template
- `package.json` - All dependencies listed

---

**You're all set! Happy building! 🎉**
