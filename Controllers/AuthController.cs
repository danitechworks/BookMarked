using BookMarked.Data;
using BookMarked.DTOs;
using BookMarked.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookMarked.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    public AuthController(
        AppDbContext context,
        IPasswordHasher<User> passwordHasher)
    {
        _context = context;
        _passwordHasher = passwordHasher;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var username = request.Username.Trim();

        if (username.Length < 3)
        {
            return BadRequest(new
            {
                message = "Username must contain at least 3 characters."
            });
        }

        var usernameExists = await _context.Users
            .AnyAsync(user => user.Username == username);

        if (usernameExists)
        {
            return Conflict(new
            {
                message = "That username is already registered."
            });
        }

        var user = new User
        {
            Username = username
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            request.Password);

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Account created successfully."
        });
    }
}
