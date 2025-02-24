namespace Application.Options;

public class MailSettingsOption
{
    public bool DefaultCredentials { get; set; }
    public string Name { get; set; } = "AioTech";
    public bool UseSSL { get; set; }
}
