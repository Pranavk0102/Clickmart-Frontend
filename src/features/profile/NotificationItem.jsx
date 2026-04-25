import { useDispatch } from 'react-redux';
import { markAsRead, deleteNotification } from './notificationSlice';
import { toast } from 'react-toastify';
import './NotificationItem.css';

const NotificationItem = ({ notification }) => {
  const dispatch = useDispatch();

  const getIconClass = (type) => {
    const icons = {
      order: 'fas fa-shopping-bag',
      ticket: 'fas fa-headset',
      info: 'fas fa-info-circle',
      success: 'fas fa-check-circle',
      warning: 'fas fa-exclamation-triangle',
    };
    return icons[type] || 'fas fa-bell';
  };

  const getIconColor = (type) => {
    const colors = {
      order: 'notif-icon-order',
      ticket: 'notif-icon-ticket',
      info: 'notif-icon-info',
      success: 'notif-icon-success',
      warning: 'notif-icon-warning',
    };
    return colors[type] || 'notif-icon-info';
  };

  const handleMarkAsRead = async () => {
    if (!notification.read) {
      try {
        await dispatch(markAsRead(notification.id)).unwrap();
      } catch {
        toast.error('Failed to mark as read');
      }
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(deleteNotification(notification.id)).unwrap();
      toast.success('Notification deleted');
    } catch {
      toast.error('Failed to delete notification');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN');
  };

  return (
    <div 
      className={`notif-item ${!notification.read ? 'unread' : ''}`}
      onClick={handleMarkAsRead}
    >
      <div className={`notif-icon ${getIconColor(notification.type)}`}>
        <i className={getIconClass(notification.type)}></i>
      </div>
      <div className="notif-content">
        <div className="notif-msg">{notification.message}</div>
        <div className="notif-time">{formatTime(notification.createdAt)}</div>
      </div>
      <button className="notif-delete" onClick={handleDelete} aria-label="Delete notification">
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default NotificationItem;
