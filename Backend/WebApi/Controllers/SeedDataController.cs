using Application.SeedData;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class SeedDataController : ControllerBase
{
    private readonly SeedDataService _service;

    public SeedDataController(SeedDataService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> SeedData()
    {
        await _service.SeedData();
        return Ok("Data seeded");
    }
}