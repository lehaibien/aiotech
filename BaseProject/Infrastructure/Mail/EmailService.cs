using Application.Mail;
using Application.Options;
using Domain.Entities;
using Domain.UnitOfWork;
using MailKit.Net.Smtp;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit;
using Newtonsoft.Json;
using Shared;

namespace Infrastructure.Mail;

public class EmailService : IEmailService
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly MailSettingsOption _option;
    private readonly IUnitOfWork _unitOfWork;

    public EmailService(
        IOptions<MailSettingsOption> option,
        IUnitOfWork unitOfWork,
        IWebHostEnvironment webHostEnvironment
    )
    {
        _option = option.Value;
        _unitOfWork = unitOfWork;
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<Result> SendAsync(string to, string subject, string body)
    {
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(x => x.Key == "email");
        if (config is null)
        {
            return Result.Failure("Không tìm thấy cấu hình email");
        }
        var emailConfig = JsonConvert.DeserializeObject<MailConfig>(config.Value);
        if (emailConfig is null)
        {
            return Result.Failure("Không tìm thấy cấu hình email");
        }
        MimeMessage message = new();
        var fromEmail = new MailboxAddress(_option.Name, emailConfig.Email);
        message.From.Add(fromEmail);
        var toEmail = new MailboxAddress(to, to);
        message.To.Add(toEmail);
        message.Subject = subject;
        var emailBodyBuilder = new BodyBuilder { TextBody = body };
        message.Body = emailBodyBuilder.ToMessageBody();
        var mailClient = new SmtpClient();
        await mailClient.ConnectAsync(emailConfig.Host, emailConfig.Port, _option.UseSSL);
        await mailClient.AuthenticateAsync(emailConfig.Email, emailConfig.Password);
        await mailClient.SendAsync(message);
        await mailClient.DisconnectAsync(true);
        mailClient.Dispose();
        return Result.Success();
    }

    public async Task<Result> SendTemplateAsync(
        string to,
        string subject,
        string templateName,
        Dictionary<string, object> data
    )
    {
        var body = ParseTemplate(templateName, data);
        if (body == "")
        {
            return Result.Failure("Không tìm thấy template");
        }
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(x => x.Key == "email");
        if (config is null)
        {
            return Result.Failure("Không tìm thấy cấu hình email");
        }
        var emailConfig = JsonConvert.DeserializeObject<MailConfig>(config.Value);
        if (emailConfig is null)
        {
            return Result.Failure("Không tìm thấy cấu hình email");
        }
        MimeMessage message = new();
        var fromEmail = new MailboxAddress(_option.Name, emailConfig.Email);
        message.From.Add(fromEmail);
        var toEmail = new MailboxAddress(to, to);
        message.To.Add(toEmail);
        message.Subject = subject;
        var emailBodyBuilder = new BodyBuilder { HtmlBody = body };
        message.Body = emailBodyBuilder.ToMessageBody();
        var mailClient = new SmtpClient();
        await mailClient.ConnectAsync(emailConfig.Host, emailConfig.Port, _option.UseSSL);
        await mailClient.AuthenticateAsync(emailConfig.Email, emailConfig.Password);
        await mailClient.SendAsync(message);
        await mailClient.DisconnectAsync(true);
        mailClient.Dispose();
        return Result.Success();
    }

    private string ParseTemplate(string templateName, Dictionary<string, object> data)
    {
        var templatePath = $"{_webHostEnvironment.WebRootPath}/templates/{templateName}.html";
        if (!File.Exists(templatePath))
        {
            return "";
        }
        var templateContent = File.ReadAllText(templatePath);
        foreach (var key in data.Keys)
        {
            var loweredKey = key.ToLowerInvariant();
            templateContent = templateContent.Replace(
                "{{" + loweredKey + "}}",
                data[key].ToString()
            );
        }
        return templateContent;
    }
}
