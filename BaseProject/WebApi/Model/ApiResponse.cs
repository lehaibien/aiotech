namespace WebApi.Model;

public class ApiResponse
{
    public bool Success { get; set; } = true;
    public object? Data { get; set; }
    public string Message { get; set; } = string.Empty;
}