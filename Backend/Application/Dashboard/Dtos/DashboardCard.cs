namespace Application.Dashboard.Dtos;

public class DashboardCard
{
    public decimal Revenue { get; set; }
    public double RevenueDiff { get; set; }
    public int Order { get; set; }
    public double OrderDiff { get; set; }
    public decimal AverageOrderValue { get; set; }
    public double AverageOrderValueDiff { get; set; }
    public int NewUser { get; set; }
    public double NewUserDiff { get; set; }
}

public class RevenueCard
{
    public decimal? Revenue { get; set; }
    public double? RevenueDiff { get; set; }
}

public class OrderCard
{
    public int? Order { get; set; }
    public double? OrderDiff { get; set; }
}

public class AverageOrderValueCard
{
    public decimal? AverageOrderValue { get; set; }
    public double? AverageOrderValueDiff { get; set; }
}

public class NewUserCard
{
    public int? NewUser { get; set; }
    public double? NewUserDiff { get; set; }
}
