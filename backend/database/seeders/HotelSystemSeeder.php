<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Hotel;
use App\Models\RoomType;
use App\Models\Room;
use App\Models\Amenity;
use App\Models\Guest;
use App\Models\Booking;
use App\Models\BookingRoom;
use App\Models\Rate;
use App\Models\Payment;
use App\Models\Charge;
use App\Models\Staff;

class HotelSystemSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users (Admin + Staff) ──────────────────────────────
        $adminUser = User::create([
            'name' => 'Admin User',
            'email' => 'admin@inntera.com',
            'password' => Hash::make('admin123'),
        ]);

        $staffUser = User::create([
            'name' => 'Mike Davis',
            'email' => 'mike.davis@watergate.com',
            'password' => Hash::make('staff123'),
        ]);

        // ── Hotels (Butuan City Philippines) ──────────────────
        $hotelsData = [
            [
                'name' => 'Watergate Boutique Hotel',
                'description' => 'A well-rated 4-star boutique hotel featuring modern amenities, an outdoor pool, restaurant, and bar. Known for its aesthetic design and central location.',
                'address' => 'Jose Rosales Ave, Doongan',
                'city' => 'Butuan City',
                'state' => 'Agusan del Norte',
                'country' => 'Philippines',
                'phone' => '+63 85 815 0088',
                'email' => 'info@watergate.com',
                'star_rating' => 4,
            ],
            [
                'name' => 'Almont Inland Resort',
                'description' => 'A resort-style hotel offering a spacious, relaxing atmosphere with family-friendly facilities, including a swimming pool and landscaped grounds.',
                'address' => 'J.C. Aquino Ave',
                'city' => 'Butuan City',
                'state' => 'Agusan del Norte',
                'country' => 'Philippines',
                'phone' => '+63 85 342 7414',
                'email' => 'stay@almontinland.com',
                'star_rating' => 4,
            ],
            [
                'name' => 'Hotel Oazis Butuan',
                'description' => 'Well-regarded hotel offering a range of premium amenities, including a magnificent pool and fine dining restaurant.',
                'address' => 'J.C. Aquino Ave',
                'city' => 'Butuan City',
                'state' => 'Agusan del Norte',
                'country' => 'Philippines',
                'phone' => '+63 85 342 8888',
                'email' => 'info@hoteloazis.com',
                'star_rating' => 4,
            ],
            [
                'name' => 'Go Hotels Butuan',
                'description' => 'A famous modern hotel located directly near Robinsons Place Butuan, ideal for travelers looking for convenience.',
                'address' => 'J.C. Aquino Ave, Brgy. Libertad',
                'city' => 'Butuan City',
                'state' => 'Agusan del Norte',
                'country' => 'Philippines',
                'phone' => '+63 922 464 6835',
                'email' => 'reservations@gohotels.ph',
                'star_rating' => 3,
            ]
        ];

        // ── Amenities ──────────────────────────────────────────
        $amenityData = [
            ['name' => 'Free WiFi', 'description' => 'High-speed wireless internet access'],
            ['name' => 'Swimming Pool', 'description' => 'Outdoor swimming pool access'],
            ['name' => 'Air Conditioning', 'description' => 'Self-controlled AC units'],
            ['name' => 'Restaurant', 'description' => 'On-site dining facilities'],
            ['name' => 'Parking', 'description' => 'Complimentary parking for guests'],
            ['name' => 'TV', 'description' => 'Flat screen TV with cable'],
            ['name' => 'Mini Bar', 'description' => 'In-room refreshments'],
            ['name' => 'Room Service', 'description' => '24/7 in-room dining'],
            ['name' => 'Convention Center', 'description' => 'Event and meeting facilities'],
            ['name' => 'Gym', 'description' => 'Fitness center access'],
        ];

        $amenities = [];
        foreach ($amenityData as $a) {
            $amenities[] = Amenity::updateOrCreate(['name' => $a['name']], $a);
        }

        foreach ($hotelsData as $index => $hData) {
            $hotel = Hotel::updateOrCreate(
                ['email' => $hData['email']],
                array_merge($hData, [
                    'display_id' => 'HTL-' . str_pad($index + 1, 3, '0', STR_PAD_LEFT),
                    'total_rooms' => 30,
                    'available_rooms' => 30,
                ])
            );

            // Create 4 levels of room types for each hotel (1st to 4th floor)
            $roomTypes = [
                'standard_single' => RoomType::updateOrCreate(
                    ['hotel_id' => $hotel->id, 'name' => 'Standard Single (1st Floor)'],
                    [
                        'description' => "Economy option. Our most affordable accommodation.",
                        'base_price' => 1200,
                        'max_occupancy' => 1,
                        'bed_type' => 'Single',
                    ]
                ),
                'standard_double' => RoomType::updateOrCreate(
                    ['hotel_id' => $hotel->id, 'name' => 'Standard Double (2nd Floor)'],
                    [
                        'description' => "Comfortable room for two with standard amenities.",
                        'base_price' => 2500,
                        'max_occupancy' => 2,
                        'bed_type' => 'Double',
                    ]
                ),
                'deluxe_double' => RoomType::updateOrCreate(
                    ['hotel_id' => $hotel->id, 'name' => 'Deluxe Double (3rd Floor)'],
                    [
                        'description' => "Spacious and enhanced comfort with premium views.",
                        'base_price' => 4500,
                        'max_occupancy' => 3,
                        'bed_type' => 'Double',
                    ]
                ),
                'executive_suite' => RoomType::updateOrCreate(
                    ['hotel_id' => $hotel->id, 'name' => 'Executive Suite (4th Floor)'],
                    [
                        'description' => "Luxurious, most expensive space with full panoramic city views.",
                        'base_price' => 12000,
                        'max_occupancy' => 4,
                        'bed_type' => 'Double',
                    ]
                ),
            ];

            // Attach amenities to higher tier rooms
            foreach ($roomTypes as $key => $rt) {
                $rt->amenities()->sync($amenities);
            }

            // Create Staff for this hotel
            $staffConfigs = [
                ['role' => 'manager', 'count' => 1],
                ['role' => 'maintenance', 'count' => 2],
                ['role' => 'housekeeping', 'count' => 2],
                ['role' => 'receptionist', 'count' => 2],
            ];
            
            static $globalStaffCounter = 1;
            
            foreach ($staffConfigs as $config) {
                for ($i = 1; $i <= $config['count']; $i++) {
                    $email = "{$config['role']}.hotel" . ($index + 1) . ".{$i}@inntera.com";
                    $u = User::updateOrCreate(
                        ['email' => $email],
                        [
                            'name' => ucfirst($config['role']) . " Staff {$i}",
                            'password' => Hash::make('password123'),
                            'role' => 'staff',
                        ]
                    );

                    Staff::updateOrCreate(
                        ['user_id' => $u->id],
                        [
                            'display_id' => 'STF-' . str_pad($globalStaffCounter++, 4, '0', STR_PAD_LEFT),
                            'hotel_id' => $hotel->id,
                            'position' => $config['role'],
                            'hire_date' => now(),
                        ]
                    );
                }
            }

            // Create 20 rooms across 4 floors for each hotel
            for ($floor = 1; $floor <= 4; $floor++) {
                $rt = match ($floor) {
                    1 => $roomTypes['standard_single'],
                    2 => $roomTypes['standard_double'],
                    3 => $roomTypes['deluxe_double'],
                    default => $roomTypes['executive_suite'],
                };

                for ($i = 1; $i <= 5; $i++) {
                    $roomNo = sprintf('%d%02d', $floor, $i);
                    $floorDisplay = match ($floor) {
                        1 => '1st',
                        2 => '2nd',
                        3 => '3rd',
                        default => $floor . 'th',
                    };

                    Room::updateOrCreate(
                        ['hotel_id' => $hotel->id, 'room_number' => $roomNo],
                        [
                            'room_type_id' => $rt->room_type_id,
                            'floor' => $floorDisplay,
                            'status' => 'available',
                        ]
                    );
                }
            }
        }

        // ── User / Admin Account ──────────────────────────────
        User::updateOrCreate(
            ['email' => 'admin@inntera.com'],
            ['name' => 'Admin User', 'password' => Hash::make('admin123'), 'role' => 'admin']
        );

        // ── Guests ─────────────────────────────────────────────
        $guest1 = Guest::updateOrCreate(
            ['email' => 'juan@example.com'],
            [
                'display_id' => 'GUEST-1001',
                'first_name' => 'Juan',
                'last_name' => 'Dela Cruz',
                'password' => Hash::make('password123'),
                'phone' => '09123456789',
                'address' => 'Brgy. Libertad, Butuan City',
            ]
        );

        $guest2 = Guest::updateOrCreate(
            ['email' => 'alice@example.com'],
            [
                'display_id' => 'GUEST-1002',
                'first_name' => 'Alice',
                'last_name' => 'Cooper',
                'password' => Hash::make('password123'),
                'phone' => '+1 (555) 123-4567',
                'address' => '789 Park Ave, New York, NY',
            ]
        );

        // ── Sample Bookings with New Payment Methods ───────────
        $allHotels = Hotel::all();
        $methods = ['gcash', 'paypal', 'paymaya', 'credit_card'];

        foreach ($allHotels->take(3) as $idx => $hotel) {
            $room = Room::where('hotel_id', $hotel->id)->where('status', 'available')->first();
            if ($room) {
                $checkin = now()->addDays($idx + 1)->format('Y-m-d');
                $checkout = now()->addDays($idx + 3)->format('Y-m-d');
                
                $booking = Booking::updateOrCreate(
                    ['booking_reference' => 'BK-BTU-' . str_pad($idx + 1, 3, '0', STR_PAD_LEFT)],
                    [
                        'guest_id' => $guest1->id,
                        'hotel_id' => $hotel->id,
                        'checkin_date' => $checkin,
                        'checkout_date' => $checkout,
                        'booking_status' => 'confirmed',
                        'total_cost' => 5000.00,
                    ]
                );

                BookingRoom::updateOrCreate(
                    ['booking_id' => $booking->booking_id],
                    [
                        'room_id' => $room->room_id,
                        'adults_count' => 2,
                        'children_count' => 0,
                        'rate' => 2500.00,
                        'number_of_nights' => 2,
                    ]
                );

                Payment::updateOrCreate(
                    ['booking_id' => $booking->booking_id],
                    [
                        'amount' => 5000.00,
                        'payment_method' => $methods[$idx % count($methods)],
                        'status' => 'completed',
                        'payment_date' => now(),
                        'transaction_id' => 'TRX-' . uniqid(),
                    ]
                );

                $room->update(['status' => 'reserved']);
            }
        }
    }
}
