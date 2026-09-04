using BookMarked.Data;
using BookMarked.DTOs;
using BookMarked.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookMarked.Services;
using Microsoft.Data.SqlClient;

namespace BookMarked.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IPasswordHasher<User> _passwordHasher;

    private readonly TokenService _tokenService;

    public AuthController(
        AppDbContext context,
        IPasswordHasher<User> passwordHasher,
        TokenService tokenService)
    {
        _context = context;
        _passwordHasher = passwordHasher;
        _tokenService = tokenService;
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

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
            when (ex.InnerException is SqlException sqlException
                  && (sqlException.Number == 2601
                      || sqlException.Number == 2627))
        {
            return Conflict(new
            {
                message = "That username is already registered."
            });
        }

        return Ok(new
        {
            message = "Account created successfully."
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var username = request.Username.Trim();

        var user = await _context.Users
            .FirstOrDefaultAsync(user => user.Username == username);

        if (user is null)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password);

        if (result == PasswordVerificationResult.Failed)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(
                user,
                request.Password);

            await _context.SaveChangesAsync();
        }

        var token = _tokenService.CreateToken(user);

        return Ok(new
        {
            token,
            username = user.Username
        });
    }
}
