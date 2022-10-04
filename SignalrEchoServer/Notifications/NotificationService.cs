using Microsoft.AspNetCore.SignalR;
using SignalrEchoServer.Hubs;

namespace SignalrEchoServer.Notifications;

public interface INotificationService
{
    Task SendToAllAsync<T>(string method, T sendObject);
}

public class NotificationService : INotificationService
{
    private readonly IHubContext<EchoHub> _hub;

    public NotificationService(IHubContext<EchoHub> hub)
    {
        _hub = hub;
    }

    public async Task SendToAllAsync<T>(string method, T sendObject)
    {
        await _hub.Clients.All.SendAsync(method, sendObject);
    }
}