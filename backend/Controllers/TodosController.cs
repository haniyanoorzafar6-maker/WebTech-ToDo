using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebTechTodoList.Data;
using WebTechTodoList.DTOs;
using WebTechTodoList.Models;

namespace WebTechTodoList.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TodosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TodosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var todos = await _context.TodoItems
            .Where(todo => todo.UserId == userId)
            .OrderByDescending(todo => todo.CreatedAt)
            .ToListAsync();

        return Ok(todos);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id, [FromQuery] int userId)
    {
        var todo = await _context.TodoItems
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId);

        if (todo == null)
        {
            return NotFound(new { message = "Todo item was not found." });
        }

        return Ok(todo);
    }

    [HttpPost]
    public async Task<IActionResult> Create(TodoCreateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userExists = await _context.Users.AnyAsync(user => user.Id == dto.UserId);
        if (!userExists)
        {
            return BadRequest(new { message = "User does not exist." });
        }

        var todo = new TodoItem
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            IsCompleted = dto.IsCompleted,
            CreatedAt = DateTime.UtcNow,
            UserId = dto.UserId
        };

        _context.TodoItems.Add(todo);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = todo.Id, userId = todo.UserId }, todo);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, TodoUpdateDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var todo = await _context.TodoItems
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == dto.UserId);

        if (todo == null)
        {
            return NotFound(new { message = "Todo item was not found." });
        }

        todo.Title = dto.Title.Trim();
        todo.Description = dto.Description.Trim();
        todo.IsCompleted = dto.IsCompleted;

        await _context.SaveChangesAsync();
        return Ok(todo);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, [FromQuery] int userId)
    {
        var todo = await _context.TodoItems
            .FirstOrDefaultAsync(item => item.Id == id && item.UserId == userId);

        if (todo == null)
        {
            return NotFound(new { message = "Todo item was not found." });
        }

        _context.TodoItems.Remove(todo);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
