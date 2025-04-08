using Microsoft.AspNetCore.SignalR;

namespace Application.Notification;

public class NotificationHub : Hub<INotificationClient>
{
    public async Task SendNotification(NotificationModel notification)
    {
        await Clients.All.ReceiveNotification(notification);
    }
}
