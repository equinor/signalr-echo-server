using Newtonsoft.Json;
using SignalrEchoServer.Models;

namespace SignalrEchoServer.Common;

public interface IBuildInformation
{
    BuildInfo GetBuildInformation();
}

// BuildInformation gets information from ./build_information.sh script
public class BuildInformation : IBuildInformation
{
    private readonly BuildInfo? _buildInformation;
    private static readonly string[] VersionFile = { "BuildInformation.json", "../BuildInformation.json", };

    public BuildInformation()
    {
        foreach (var f in VersionFile)
        {
            if (!File.Exists(f)) continue;
            using var r = new StreamReader(f);
            _buildInformation = JsonConvert.DeserializeObject<BuildInfo>(r.ReadToEnd());
            break;
        }
    }

    public BuildInfo GetBuildInformation()
    {
        return _buildInformation ?? new BuildInfo();
    }
}