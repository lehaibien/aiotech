﻿namespace Application.Shared;

public class FileMetadata
{
    public string FileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long Size { get; set; }
    public DateTime LastModified { get; set; }
    public Dictionary<string, string> MetaData { get; set; } = [];
}
