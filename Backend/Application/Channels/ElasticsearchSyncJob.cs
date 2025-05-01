namespace Application.Channels;

using System.Threading;
using System.Threading.Channels;
using Elastic.Clients.Elasticsearch;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

public class ElasticsearchSyncBackgroundService : BackgroundService
{
    private readonly ElasticsearchClient _elasticClient;
    private readonly ILogger<ElasticsearchSyncBackgroundService> _logger;
    private readonly Channel<ESProductSync> _channel;

    public ElasticsearchSyncBackgroundService(
        ElasticsearchClient elasticClient,
        ILogger<ElasticsearchSyncBackgroundService> logger,
        Channel<ESProductSync> channel
    )
    {
        _elasticClient = elasticClient;
        _logger = logger;
        _channel = channel;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var job in _channel.Reader.ReadAllAsync(stoppingToken))
        {
            try
            {
                _logger.LogInformation("Elasticsearch sync job started");
                await ProcessJobAsync(job);
            }
            catch (OperationCanceledException)
            {
                _logger.LogInformation("Elasticsearch sync job cancelled");
                return;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync Elasticsearch");
            }
        }
    }

    private async Task ProcessJobAsync(ESProductSync job)
    {
        var response = await _elasticClient.IndexAsync(
            new IndexRequest<ESProductSync>(job, index: "mydata") { Document = job }
        );

        if (!response.IsValidResponse)
        {
            _logger.LogError(
                "Failed to index record {Id}: {Error}",
                job.Id,
                response.DebugInformation
            );
        }
    }
}
