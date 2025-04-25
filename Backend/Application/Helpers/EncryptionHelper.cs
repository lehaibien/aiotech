using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace Application.Helpers;

public class EncryptionHelper
{
    public static string HashPassword(string password, out byte[] salt)
    {
        var rng = RandomNumberGenerator.Create();
        const KeyDerivationPrf Pbkdf2Prf = KeyDerivationPrf.HMACSHA1; // default for Rfc2898DeriveBytes
        const int Pbkdf2IterCount = 1000; // default for Rfc2898DeriveBytes
        const int Pbkdf2SubkeyLength = 256 / 8; // 256 bits
        const int SaltSize = 128 / 8; // 128 bits

        // Produce a version 2 (see comment above) text hash.
        salt = new byte[SaltSize];
        rng.GetBytes(salt);
        byte[] subkey = KeyDerivation.Pbkdf2(password, salt, Pbkdf2Prf, Pbkdf2IterCount, Pbkdf2SubkeyLength);

        var outputBytes = new byte[1 + SaltSize + Pbkdf2SubkeyLength];
        outputBytes[0] = 0x00; // format marker
        Buffer.BlockCopy(salt, 0, outputBytes, 1, SaltSize);
        Buffer.BlockCopy(subkey, 0, outputBytes, 1 + SaltSize, Pbkdf2SubkeyLength);
        return Convert.ToBase64String(outputBytes);
    }

    public static bool VerifyHashedPassword(string hashedPassword, byte[] salt, string password)
    {
        ArgumentNullException.ThrowIfNull(hashedPassword);
        ArgumentNullException.ThrowIfNull(password);
        const KeyDerivationPrf Pbkdf2Prf = KeyDerivationPrf.HMACSHA1; // default for Rfc2898DeriveBytes
        const int Pbkdf2IterCount = 1000; // default for Rfc2898DeriveBytes
        const int Pbkdf2SubkeyLength = 256 / 8; // 256 bits
        const int SaltSize = 128 / 8; // 128 bits
        byte[] hashedBytes = Convert.FromBase64String(hashedPassword);
        // We know ahead of time the exact length of a valid hashed password payload.
        if(hashedBytes.Length != 1 + SaltSize + Pbkdf2SubkeyLength)
        {
            return false; // bad size
        }
        Buffer.BlockCopy(hashedBytes, 1, salt, 0, salt.Length);

        byte[] expectedSubkey = new byte[Pbkdf2SubkeyLength];
        Buffer.BlockCopy(hashedBytes, 1 + salt.Length, expectedSubkey, 0, expectedSubkey.Length);

        // Hash the incoming password and verify it
        byte[] actualSubkey = KeyDerivation.Pbkdf2(password, salt, Pbkdf2Prf, Pbkdf2IterCount, Pbkdf2SubkeyLength);
        return CryptographicOperations.FixedTimeEquals(actualSubkey, expectedSubkey);
    }

    public static string GenerateSecureToken(int length = 32)
    {
        // Define the length of the token in bytes (e.g., 32 bytes = 256 bits)
        byte[] randomBytes = new byte[length];

        // Use RandomNumberGenerator to generate random bytes
        RandomNumberGenerator.Fill(randomBytes);

        // Convert the random bytes to a Base64-encoded string for readability
        string token = Convert.ToBase64String(randomBytes);

        // Optionally, remove non-URL-safe characters (e.g., '+', '/', '=')
        return token.Replace('+', '-').Replace('/', '_').TrimEnd('=');
    }
}