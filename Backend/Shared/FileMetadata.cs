namespace Shared;

public class FileMetadata
{
    public string FileName { get; set; } = null!;
    public string ContentType { get; set; } = null!;
    public long Size { get; set; }
    public DateTime LastModified { get; set; }
    public Dictionary<string, string> MetaData { get; set; } = new();
}