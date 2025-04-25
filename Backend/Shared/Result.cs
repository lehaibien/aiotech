namespace Shared;

public sealed class Result<T> where T : class
{
    public T Value { get; set; }
    public bool IsSuccess { get; }
    public bool IsFailure => !IsSuccess;
    public string Message { get; set; }

    /// <summary>
    /// Initializes a new instance of the <see cref="Result{T}"/> class with the specified success state, value, and message.
    /// </summary>
    /// <param name="success">Indicates whether the operation was successful.</param>
    /// <param name="value">The result value if the operation succeeded; otherwise, null.</param>
    /// <param name="message">An optional message, typically used for failure details.</param>
    private Result(bool success, T value, string message)
    {
        IsSuccess = success;
        Value = value;
        Message = message;
    }

    /// <summary>
    /// Creates a successful result containing the specified value.
    /// </summary>
    /// <param name="value">The value to associate with the successful result.</param>
    /// <returns>A <see cref="Result{T}"/> representing a successful operation with the provided value.</returns>
    public static Result<T> Success(T value)
    {
        return new Result<T>(true, value, null!);
    }

    /// <summary>
    /// Creates a failed <see cref="Result{T}"/> with the specified failure message.
    /// </summary>
    /// <param name="message">The message describing the reason for failure.</param>
    /// <returns>A failed result containing no value and the provided message.</returns>
    public static Result<T> Failure(string message)
    {
        return new Result<T>(false, null!, message);
    }
    /// <summary>
    /// Returns the result value if the operation was successful; otherwise, throws an exception.
    /// </summary>
    /// <returns>The value associated with a successful result.</returns>
    /// <exception cref="Exception">Thrown if the result represents a failure.</exception>
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