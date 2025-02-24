namespace Application.Options;

public class VnPayOption
{
    public string TmnCode { get; set; } = string.Empty;
    public string HashSecret { get; set; } = string.Empty;
    public string BaseUrl { get; set; } = string.Empty;
    public string Command { get; set; } = string.Empty;
    public string CurrCode { get; set; } = string.Empty;
    public string Version { set; get; } = string.Empty;
    public string Locale { set; get; } = string.Empty;
    public string ReturnUrl { get; set; } = string.Empty;
    public string TimeZoneId { set; get; } = string.Empty;
}