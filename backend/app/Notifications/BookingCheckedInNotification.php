<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCheckedInNotification extends Notification
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
        return [
            'type' => 'booking_checked_in',
            'title' => 'Checked In Successfully!',
            'message' => "Welcome to " . $this->booking->hotel->name . "! Your check-in process for booking (" . $this->booking->booking_reference . ") is complete. Enjoy your stay!",
            'booking_id' => $this->booking->booking_id,
            'booking_reference' => $this->booking->booking_reference,
            'hotel_name' => $this->booking->hotel->name,
            'checkin_date' => $this->booking->checkin_date,
            'checkout_date' => $this->booking->checkout_date,
        ];
    }
}
