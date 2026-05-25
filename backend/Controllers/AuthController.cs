using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebTechTodoList.Data;
using WebTechTodoList.DTOs;
using WebTechTodoList.Models;
using WebTechTodoList.Services;

namespace WebTechTodoList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IPasswordService _passwordService;

    public AuthController(ApplicationDbContext context, IPasswordService passwordService)
    {
        _context = context;
        _passwordService = passwordService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var normalizedEmail = dto.Email.Trim().ToLower();
        var emailExists = await _context.Users.AnyAsync(user => user.Email == normalizedEmail);

        if (emailExists)
        {
            return BadRequest(new { message = "Email is already registered." });
        }

        var user = new User
        {
            FullName = dto.FullName.Trim(),
            Email = normalizedEmail,
            PasswordHash = _passwordService.HashPassword(dto.Password)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Registration successful." });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var normalizedEmail = dto.Email.Trim().ToLower();
        var user = await _context.Users.FirstOrDefaultAsync(item => item.Email == normalizedEmail);

        if (user == null || !_passwordService.VerifyPassword(dto.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(new
        {
            userId = user.Id,
            fullName = user.FullName,
            email = user.Email
        });
    }
}
