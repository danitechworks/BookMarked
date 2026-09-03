using System.ComponentModel.DataAnnotations;

namespace BookMarked.DTOs;

public class BookRequest
{
    [Required]
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Author { get; set; } = string.Empty;

    [Required]
    public DateOnly PublicationDate { get; set; }
}
