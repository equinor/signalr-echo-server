using SignalrEchoServer.Common;
using SignalrEchoServer.Hubs;
using SignalrEchoServer.Notifications;
using SignalrEchoServer.Services;

namespace SignalrEchoServer;

public class Startup
{
    // This method gets called by the runtime. Use this method to add services to the container.
    // For more information on how to configure your application, visit https://go.microsoft.com/fwlink/?LinkID=398940
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IEchoService, EchoService>();
        services.AddSingleton<INotificationService, NotificationService>();

        services.AddSingleton<IBuildInformation, BuildInformation>();

        services.AddControllers();

        services.AddRazorPages();
        services.AddSignalR();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            var wsEndpoint = Environment.GetEnvironmentVariable("ECHO_WS_ENDPOINT");

            endpoints.MapRazorPages();
            endpoints.MapHub<EchoHub>(wsEndpoint ?? "/echo");
            endpoints.MapControllers();
        });
    }
}