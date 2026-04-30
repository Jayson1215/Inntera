<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class BookingStatusNotification extends Notification
{
    use Queueable;

    protected $booking;
    protected $type;
    protected $title;
    protected $message;

    /**
     * Create a new notification instance.
     */
    public function __construct($booking, $type, $title, $message)
    {
        $this->booking = $booking;
        $this->type = $type;
        $this->title = $title;
        $this->message = $message;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => $this->title,
            'message' => $this->message,
            'booking_id' => $this->booking->booking_id,
            'booking_reference' => $this->booking->booking_reference,
            'timestamp' => now()->toDateTimeString(),
        ];
    }
}
