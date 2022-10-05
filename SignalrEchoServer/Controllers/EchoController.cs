using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using SignalrEchoServer.Services;

namespace SignalrEchoServer.Controllers;

[ApiController]
public class EchoController : ControllerBase
{
    private ILogger<EchoController> _logger;
    private IEchoService _echoService;

    public EchoController(IEchoService echoService, ILogger<EchoController> logger)
    {
        _echoService = echoService;
        _logger = logger;
    }

    [HttpPost]
    [Route("api/echo")]
    public async Task<IActionResult> Create([FromBody] dynamic jsonData)
    {
        try
        {
            var data = JsonConvert.DeserializeObject<dynamic>(jsonData.ToString());

            // Get fields from dynamic input
            string topic = data["topic"];
            var payload = data["payload"];

            // Convert and send to EchoService
            var resp = JsonConvert.SerializeObject(payload);
            await _echoService.Create(topic, resp);

            // Return data for debug
            return Ok(resp);
        }
        catch (Exception e)
        {
            _logger.LogWarning("Error: {E}", e);
            return BadRequest();
        }
    }
}