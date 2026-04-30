import { useState } from 'react';
import { Bell, Trash2, Calendar, Tag, Info } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Badge } from './badge';
import { ScrollArea } from './scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, deleteAllNotifications } = useNotifications();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleNotificationClick = async (n: any) => {
    if (!n.read_at) {
      await markAsRead(n.id);
    }
    
    setIsOpen(false); // Close popover when clicked

    // Redirect logic based on notification type
    if (n.data.booking_id) {
       // Check user role to decide where to navigate
       const stored = localStorage.getItem('hotel_user');
       const user = stored ? JSON.parse(stored) : null;
       
       if (user?.role === 'guest') {
         navigate('/client/bookings', { state: { highlightedBookingId: n.data.booking_id } });
       } else if (user?.role === 'admin') {
         navigate('/admin/bookings', { state: { highlightedBookingId: n.data.booking_id } });
       } else {
         navigate('/staff/bookings', { state: { highlightedBookingId: n.data.booking_id } });
       }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[20px] h-5 flex items-center justify-center bg-rose-500 text-white border-2 border-white text-[10px] font-bold animate-in zoom-in">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0 bg-white rounded-2xl shadow-2xl border-slate-100 overflow-hidden" align="end">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            Notifications
            {unreadCount > 0 && <span className="text-xs font-medium text-slate-400">({unreadCount} unread)</span>}
          </h3>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 h-7 px-2"
              >
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={deleteAllNotifications}
                className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 h-7 px-2"
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                <Bell className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-sm font-semibold text-slate-900">All caught up!</p>
              <p className="text-xs text-slate-400 mt-1">No new notifications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => (
                <div 
                  key={n.id} 
                  className={cn(
                    "p-4 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                    !n.read_at && "bg-blue-50/40 hover:bg-blue-50/60"
                  )}
                  onClick={() => handleNotificationClick(n)}
                >
                  {!n.read_at && (
                    <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                  )}
                  
                  <div className="flex gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      n.data.type === 'room_booked' ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600"
                    )}>
                      {n.data.type === 'room_booked' ? <Calendar className="w-5 h-5" /> : <Tag className="w-5 h-5" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={cn("text-sm font-bold text-slate-900 truncate", !n.read_at && "text-blue-900")}>
                          {n.data.title}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">
                          {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {n.data.message}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          #{n.data.booking_reference}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 bottom-2 w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(n.id);
                    }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <Button 
                variant="link" 
                size="sm" 
                className="text-xs font-bold text-slate-400 hover:text-slate-600 h-auto p-0"
                onClick={() => {
                  const stored = localStorage.getItem('hotel_user');
                  const user = stored ? JSON.parse(stored) : null;
                  if (user?.role === 'guest') navigate('/client/bookings');
                  else if (user?.role === 'admin') navigate('/admin/bookings');
                  else navigate('/staff/bookings');
                }}
            >
              View all activity
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
