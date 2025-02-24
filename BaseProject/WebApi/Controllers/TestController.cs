using Application.Notification;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    private readonly IHubContext<NotificationHub, INotificationClient> _hubContext;

    public TestController(IHubContext<NotificationHub, INotificationClient> hubContext)
    {
        _hubContext = hubContext;
    }

    [HttpPost]
    public IActionResult Post([FromBody] NotificationModel notification)
    {
        _hubContext.Clients.All.ReceiveNotification(notification);
        return Ok();
    }
}
