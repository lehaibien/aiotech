namespace Shared;

public sealed class Result<T> where T : class
{
    public T Data { get; set; }
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Message { get; set; }

    private Result(bool success, T data, string message)
    {
        IsSuccess = success;
        Data = data;
        Message = message;
    }

    public static Result<T> Success(T data)
    {
        return new Result<T>(true, data, null!);
    }

    public static Result<T> Failure(string message)
    {
        return new Result<T>(false, null!, message);
    }
    public T Expect()
    {
        if (IsSuccess)
        {
            return Data;
        }
        throw new Exception("Cannot get data from failed result");
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