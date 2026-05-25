using System.ComponentModel.DataAnnotations;

namespace WebTechTodoList.DTOs;

public class TodoCreateDto
{
    [Required]
    [MaxLength(150)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    [Required]
    public int UserId { get; set; }
}
