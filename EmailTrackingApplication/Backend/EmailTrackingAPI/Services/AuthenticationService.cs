using EmailTrackingAPI.Models;
using EmailTrackingAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EmailTrackingAPI.Services
{
    public interface IAuthenticationService
    {
        Task<LoginResponse?> Login(LoginRequest request);
        bool ValidatePassword(string password, string storedHash);
        string HashPassword(string password);
    }

    public class AuthenticationService : IAuthenticationService
    {
        private readonly ApplicationDbContext _context;

        public AuthenticationService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<LoginResponse?> Login(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.UsernameOrEmail) || 
                string.IsNullOrWhiteSpace(request.Password))
                return null;

            // Find user by username or email
            var user = await _context.Users.FirstOrDefaultAsync(u =>
                (u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail) &&
                u.IsActive);

            if (user == null)
                return null;

            // For demo purposes, comparing plain passwords. In production, use hashed passwords
            // Uncomment the line below for production with hashed passwords
            // if (!ValidatePassword(request.Password, user.Password))
            //     return null;

            if (user.Password != request.Password)
                return null;

            return new LoginResponse
            {
                UserId = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsDirector = user.IsDirector
            };
        }

        public bool ValidatePassword(string password, string storedHash)
        {
            // Using simple comparison for demo. Implement proper hashing in production
            return password == storedHash;
        }

        public string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
