namespace Application.Reports.Dtos
{
    public class LowRatingProductReportRequest : BaseReportRequest
    {
        public Guid? BrandId { get; set; }
        public Guid? CategoryId { get; set; }
    }
}
