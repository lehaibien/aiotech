using Microsoft.EntityFrameworkCore;

namespace Application.Shared;

public class PaginatedList<T>
{
    private PaginatedList() { }
    public List<T> Items { get; private set; } = [];
    public int PageIndex { get; private set; } = CommonConst.PageIndex;
    public int PageSize { get; private set; } = CommonConst.PageSize;
    public int TotalCount { get; private set; }
    public bool HasPreviousPage => PageIndex > 0;
    public bool HasNextPage => (PageIndex + 1) * PageSize < TotalCount;

    public static PaginatedList<T> Create(IEnumerable<T> items, int pageIndex, int pageSize, int totalCount)
    {
        return new PaginatedList<T>
        {
            PageIndex = pageIndex, PageSize = pageSize, TotalCount = totalCount, Items = items.ToList()
        };
    }

    public static PaginatedList<T> Create(IQueryable<T> source, int pageIndex, int pageSize)
    {
        var count = source.Count();
        var items = source
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToList();
        return new PaginatedList<T> { PageIndex = pageIndex, PageSize = pageSize, TotalCount = count, Items = items };
    }

    public static async Task<PaginatedList<T>> CreateAsync(IQueryable<T> source, int pageIndex, int pageSize,
        CancellationToken cancellationToken = default)
    {
        var count = await source.CountAsync(cancellationToken);
        var items = await source
            .Skip(pageIndex * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
        return new PaginatedList<T> { PageIndex = pageIndex, PageSize = pageSize, TotalCount = count, Items = items };
    }
}