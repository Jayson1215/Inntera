<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RoomBookedNotification extends Notification
{
    use Queueable;

    protected $booking;

    /**
     * Create a new notification instance.
     */
    public function __construct($booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $guest = $this->booking->guest;
        return [
            'type' => 'room_booked',
            'title' => 'New Guest Booking',
            'message' => ($guest->first_name . ' ' . $guest->last_name) . " has booked a room.",
            'booking_id' => $this->booking->booking_id,
            'booking_reference' => $this->booking->booking_reference,
            'guest_name' => $guest->first_name . ' ' . $guest->last_name,
            'guest_email' => $guest->email,
            'checkin_date' => $this->booking->checkin_date,
            'checkout_date' => $this->booking->checkout_date,
            'total_cost' => $this->booking->total_cost,
        ];
    }
}
