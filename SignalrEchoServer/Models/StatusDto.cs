namespace SignalrEchoServer.Models;

public class StatusDto
{
    public string Name { get; init; } = "";
    public BuildInformationDto BuildInformation { get; set; } = new();
}

public class BuildInformationDto
{
    public string Version { get; init; } = "0.0.0";
    public DateTime Created { get; init; } = new();
}