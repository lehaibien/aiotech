namespace Application.Shared;

public sealed class Result<T> where T : class
{
    public T Value { get; set; }
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Message { get; set; }

    private Result(bool success, T value, string message)
    {
        IsSuccess = success;
        Value = value;
        Message = message;
    }

    public static Result<T> Success(T value)
    {
        return new Result<T>(true, value, null!);
    }

    public static Result<T> Failure(string message)
    {
        return new Result<T>(false, null!, message);
    }
    public T Expect()
    {
        if (IsSuccess)
        {
            return Value;
        }
        throw new Exception("Cannot get value from failed result");
    }
}

public sealed class Result
{
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Message { get; set; }
    private Result(bool success, string message)
    {
        IsSuccess = success;
        Message = message;
    }
    
    public static Result Success()
    {
        return new Result(true, null!);
    }
    
    public static Result Failure(string message)
    {
        return new Result(false, message);
    }
}