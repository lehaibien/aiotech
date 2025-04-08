namespace Application.Authentication.Dtos;

public class ConfirmEmailRequest
{
    public Guid UserId { get; set; }
    public required string Email { get; set; }
}
