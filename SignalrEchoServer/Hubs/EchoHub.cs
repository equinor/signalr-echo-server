using Microsoft.AspNetCore.SignalR;

namespace SignalrEchoServer.Hubs;

public class EchoHub : Hub
{
    public async Task SendMessage(string topic, string payload)
    {
        await Clients.All.SendAsync(topic, payload);
    }
}