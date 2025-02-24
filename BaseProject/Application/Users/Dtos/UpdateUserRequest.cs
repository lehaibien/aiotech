namespace Application.Users.Dtos;

public class UpdateUserRequest : UserRequest
{
    public Guid Id { get; set; }
}