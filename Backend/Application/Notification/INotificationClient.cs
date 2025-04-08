namespace Application.Notification;

public interface INotificationClient
{
    Task ReceiveNotification(NotificationModel notification);
}
