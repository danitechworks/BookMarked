using System.ComponentModel.DataAnnotations;

namespace BookMarked.DTOs;

public class QuoteRequest
{
    [Required]
    [MaxLength(500)]
    public string Text { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    public string Author { get; set; } = string.Empty;
}
