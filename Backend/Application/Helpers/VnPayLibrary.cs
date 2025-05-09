using System.Globalization;
using System.Net;
using System.Net.Sockets;
using System.Security.Cryptography;
using System.Text;
using Application.Options;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Helpers;

public class VnPayLibrary
{
    private readonly SortedList<string, string> _requestData = new SortedList<string, string>(
        new VnPayCompare()
    );
    private readonly SortedList<string, string> _responseData = new SortedList<string, string>(
        new VnPayCompare()
    );

    public static string CreatePaymentUrl(Order order, VnPayOption option, HttpContext context)
    {
        var info = Utilities.GenerateOrderInfo(order.TrackingNumber, order.Name, order.TotalPrice);
        var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(option.TimeZoneId);
        var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
        var pay = new VnPayLibrary();
        var urlCallBack = option.ReturnUrl;

        pay.AddRequestData("vnp_Version", option.Version);
        pay.AddRequestData("vnp_Command", option.Command);
        pay.AddRequestData("vnp_TmnCode", option.TmnCode);
        pay.AddRequestData("vnp_Amount", (Convert.ToInt64(order.TotalPrice) * 100).ToString());
        pay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
        pay.AddRequestData("vnp_CurrCode", option.CurrCode);
        pay.AddRequestData("vnp_IpAddr", pay.GetIpAddress(context));
        pay.AddRequestData("vnp_Locale", option.Locale);
        pay.AddRequestData("vnp_OrderInfo", info);
        pay.AddRequestData("vnp_OrderType", 130000.ToString());
        pay.AddRequestData("vnp_ReturnUrl", urlCallBack);
        pay.AddRequestData("vnp_TxnRef", order.Id.ToString());

        return pay.CreateRequestUrl(option.BaseUrl, option.HashSecret);
    }

    public PaymentResponse GetFullResponseData(IQueryCollection collection, string hashSecret)
    {
        var vnPay = new VnPayLibrary();

        foreach (var (key, value) in collection)
        {
            if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
            {
                vnPay.AddResponseData(key, value);
            }
        }

        var orderAmouth = Convert.ToInt64(vnPay.GetResponseData("vnp_Amount")) / 100; // divided by 100 because the VNPay said so
        var payDate = DateTime.ParseExact(
            vnPay.GetResponseData("vnp_PayDate"),
            "yyyyMMddHHmmss",
            CultureInfo.InvariantCulture
        );
        var orderId = vnPay.GetResponseData("vnp_TxnRef");
        var vnPayTranId = Convert.ToInt64(vnPay.GetResponseData("vnp_TransactionNo"));
        var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
        var vnpSecureHash = collection.FirstOrDefault(k => k.Key == "vnp_SecureHash").Value; //hash của dữ liệu trả về
        var orderInfo = vnPay.GetResponseData("vnp_OrderInfo");

        var checkSignature = vnPay.ValidateSignature(vnpSecureHash, hashSecret); //check Signature

        if (!checkSignature)
            return new PaymentResponse() { Success = false };

        return new PaymentResponse()
        {
            Success = vnpResponseCode.Equals("00"),
            PaymentMethod = "VnPay",
            OrderDescription = orderInfo,
            OrderId = orderId.ToString(),
            PaymentId = vnPayTranId.ToString(),
            TransactionId = vnPayTranId.ToString(),
            Amount = orderAmouth,
            PayDate = payDate,
            Token = vnpSecureHash,
            ResponseCode = vnpResponseCode,
        };
    }

    public string GetIpAddress(HttpContext context)
    {
        var ipAddress = string.Empty;
        try
        {
            var remoteIpAddress = context.Connection.RemoteIpAddress;

            if (remoteIpAddress != null)
            {
                // Handle IPv6-mapped IPv4 addresses
                if (remoteIpAddress.IsIPv4MappedToIPv6)
                {
                    remoteIpAddress = remoteIpAddress.MapToIPv4();
                }
                else if (remoteIpAddress.AddressFamily == AddressFamily.InterNetworkV6)
                {
                    // If it's a pure IPv6 address, try to get an IPv4 address if available
                    var ipv4Address = Dns.GetHostEntry(remoteIpAddress)
                        .AddressList.FirstOrDefault(x =>
                            x.AddressFamily == AddressFamily.InterNetwork
                        );
                    if (ipv4Address != null)
                    {
                        remoteIpAddress = ipv4Address;
                    }
                }

                if (remoteIpAddress != null)
                    ipAddress = remoteIpAddress.ToString();

                return ipAddress;
            }
        }
        catch (Exception ex)
        {
            // Log the exception if needed
            return ex.Message;
        }

        return "127.0.0.1";
    }

    public void AddRequestData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            _requestData.Add(key, value);
        }
    }

    public void AddResponseData(string key, string value)
    {
        if (!string.IsNullOrEmpty(value))
        {
            _responseData.Add(key, value);
        }
    }

    public string GetResponseData(string key)
    {
        return _responseData.TryGetValue(key, out var retValue) ? retValue : string.Empty;
    }

    public string CreateRequestUrl(string baseUrl, string vnpHashSecret)
    {
        var data = new StringBuilder();

        foreach (var (key, value) in _requestData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
        {
            data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
        }

        var querystring = data.ToString();

        baseUrl += "?" + querystring;
        var signData = querystring;
        if (signData.Length > 0)
        {
            signData = signData.Remove(data.Length - 1, 1);
        }

        var vnpSecureHash = HmacSha512(vnpHashSecret, signData);
        baseUrl += "vnp_SecureHash=" + vnpSecureHash;

        return baseUrl;
    }

    public bool ValidateSignature(string inputHash, string secretKey)
    {
        var rspRaw = GetResponseData();
        var myChecksum = HmacSha512(secretKey, rspRaw);
        return myChecksum.Equals(inputHash, StringComparison.InvariantCultureIgnoreCase);
    }

    private string HmacSha512(string key, string inputData)
    {
        var hash = new StringBuilder();
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(inputData);
        using (var hmac = new HMACSHA512(keyBytes))
        {
            var hashValue = hmac.ComputeHash(inputBytes);
            foreach (var theByte in hashValue)
            {
                hash.Append(theByte.ToString("x2"));
            }
        }

        return hash.ToString();
    }

    private string GetResponseData()
    {
        var data = new StringBuilder();
        if (_responseData.ContainsKey("vnp_SecureHashType"))
        {
            _responseData.Remove("vnp_SecureHashType");
        }

        if (_responseData.ContainsKey("vnp_SecureHash"))
        {
            _responseData.Remove("vnp_SecureHash");
        }

        foreach (var (key, value) in _responseData.Where(kv => !string.IsNullOrEmpty(kv.Value)))
        {
            data.Append(WebUtility.UrlEncode(key) + "=" + WebUtility.UrlEncode(value) + "&");
        }

        //remove last '&'
        if (data.Length > 0)
        {
            data.Remove(data.Length - 1, 1);
        }

        return data.ToString();
    }
}

public class VnPayCompare : IComparer<string>
{
    public int Compare(string x, string y)
    {
        if (x == y)
            return 0;
        if (x == null)
            return -1;
        if (y == null)
            return 1;
        var vnpCompare = CompareInfo.GetCompareInfo("en-US");
        return vnpCompare.Compare(x, y, CompareOptions.Ordinal);
    }
}
