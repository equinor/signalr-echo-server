using Microsoft.AspNetCore.Mvc;
using SignalrEchoServer.Common;
using SignalrEchoServer.Models;

namespace SignalrEchoServer.Controllers;

[ApiController]
public class CommonController : ControllerBase
{
    private readonly ILogger<CommonController> _logger;
    private readonly IBuildInformation _buildInformation;

    public CommonController(IBuildInformation buildInformation, ILogger<CommonController> logger)
    {
        _buildInformation = buildInformation;
        _logger = logger;
    }

    [HttpGet]
    [Route("status")]
    public ActionResult<StatusDto> Status()
    {
        return Ok(MapBuildVersionToStatusDto());
    }

    private StatusDto MapBuildVersionToStatusDto()
    {
        return new StatusDto
        {
            Name = _buildInformation.GetBuildInformation().Name,
            BuildInformation = new BuildInformationDto
            {
                Created = _buildInformation.GetBuildInformation().Created,
                Version = _buildInformation.GetBuildInformation().Version
            }
        };
    }
}