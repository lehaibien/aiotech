using Shared;

namespace Application.Mail;

public interface IEmailService
{
    Task<Result> SendAsync(string to, string subject, string body);
    Task<Result> SendTemplateAsync(
        string to,
        string subject,
        string templateName,
        Dictionary<string, object> data
    );
}
