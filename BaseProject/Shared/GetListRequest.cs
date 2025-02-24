namespace Shared;

public class GetListRequest
{
    public string TextSearch { get; set; } = string.Empty;
    public int PageIndex { get; set; } = 0;
    public int PageSize { get; set; } = 10;
}
