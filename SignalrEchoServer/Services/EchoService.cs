using Newtonsoft.Json.Linq;
using SignalrEchoServer.Hubs;
using SignalrEchoServer.Notifications;

namespace SignalrEchoServer.Services;

public interface IEchoService
{
    Task Create<T>(string topic, T payload);
}

public class EchoService : IEchoService
{
    private readonly INotificationService _notificationService;

    public EchoService(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    public async Task Create<T>(string topic, T payload) {
        await _notificationService.SendToAllAsync(topic, payload);
    }
}