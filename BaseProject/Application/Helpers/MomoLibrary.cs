using System.Security.Cryptography;
using System.Text;
using Application.Options;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Application.Helpers;

public class MomoLibrary
{
    private readonly MomoOption _options;
    private readonly IHttpClientFactory _httpClient;

    public MomoLibrary(IOptions<MomoOption> options, IHttpClientFactory httpClient)
    {
        _options = options.Value;
        _httpClient = httpClient;
    }

    public async Task<string> CreatePaymentUrlAsync(Order order)
    {
        var info = $"Đơn hàng #{order.TrackingNumber} - {order.Name}: {order.TotalPrice}";
        var rawData =
            $"partnerCode={_options.PartnerCode}&accessKey={_options.AccessKey}&requestId={order.Id}&amount={order.TotalPrice}&orderId={order.Id}&orderInfo={info}&returnUrl={_options.ReturnUrl}&notifyUrl={_options.NotifyUrl}&extraData=";

        var signature = ComputeHmacSha256(rawData, _options.SecretKey);

        var requestData = new
        {
            accessKey = _options.AccessKey,
            partnerCode = _options.PartnerCode,
            requestType = _options.RequestType,
            notifyUrl = _options.NotifyUrl,
            returnUrl = _options.ReturnUrl,
            orderId = order.Id,
            amount = order.TotalPrice.ToString(),
            orderInfo = info,
            requestId = order.Id,
            extraData = "",
            signature = signature,
        };

        var request = new StringContent(
            JsonConvert.SerializeObject(requestData),
            Encoding.UTF8,
            "application/json"
        );

        var httpClient = _httpClient.CreateClient();
        httpClient.BaseAddress = new Uri(_options.MomoApiUrl);

        var response = await httpClient.PostAsync("", request);
        var responseContent = await response.Content.ReadAsStringAsync();

        var content = JsonConvert.DeserializeObject<MomoCreatePaymentResponse>(responseContent);
        return content.PayUrl;
    }

    public async Task<PaymentResponse> PaymentExecuteAsync(IQueryCollection collection)
    {
        collection.TryGetValue("orderInfo", out var orderInfo);
        collection.TryGetValue("orderId", out var orderId);
        collection.TryGetValue("transId", out var transactionId);
        collection.TryGetValue("errorCode", out var code);
        collection.TryGetValue("signature", out var hash);

        return new PaymentResponse()
        {
            Success = code.Equals("0"),
            OrderId = orderId,
            Token = hash,
            OrderDescription = orderInfo,
            TransactionId = transactionId,
            PaymentId = transactionId,
            PaymentMethod = "Momo",
            ResponseCode = code,
        };
    }

    private string ComputeHmacSha256(string message, string secretKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var messageBytes = Encoding.UTF8.GetBytes(message);

        byte[] hashBytes;

        using (var hmac = new HMACSHA256(keyBytes))
        {
            hashBytes = hmac.ComputeHash(messageBytes);
        }

        var hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

        return hashString;
    }
}

public class MomoCreatePaymentResponse
{
    public string RequestId { get; set; }
    public int ErrorCode { get; set; }
    public string OrderId { get; set; }
    public string Message { get; set; }
    public string LocalMessage { get; set; }
    public string RequestType { get; set; }
    public string PayUrl { get; set; }
    public string Signature { get; set; }
    public string QrCodeUrl { get; set; }
    public string Deeplink { get; set; }
    public string DeeplinkWebInApp { get; set; }
}
