namespace Shared;

public class PaginatedList
{
    public int PageIndex { get; set; } = CommonConst.PageIndex;
    public int PageSize { get; set; } = CommonConst.PageSize;
    public int TotalCount { get; set; }
    public IEnumerable<object> Items { get; set; } = [];
}

public class PaginatedList<T>
{
    public int PageIndex { get; set; } = CommonConst.PageIndex;
    public int PageSize { get; set; } = CommonConst.PageSize;
    public int TotalCount { get; set; }
    public List<T> Items { get; set; } = [];
}
