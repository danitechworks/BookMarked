using BookMarked.Data;
using BookMarked.DTOs;
using BookMarked.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BookMarked.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuotesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuotesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quote>>> GetAll()
        {
            var quotes = await _context.Quotes.ToListAsync();

            return Ok(quotes);
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Quote>> GetById(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote is null)
            {
                return NotFound();
            }

            return Ok(quote);
        }

        [HttpPost]
        public async Task<ActionResult<Quote>> Create(QuoteRequest request)
        {
            var quote = new Quote
            {
                Text = request.Text,
                Author = request.Author
            };

            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetById),
                new { id = quote.Id },
                quote);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, QuoteRequest request)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote is null)
            {
                return NotFound();
            }

            quote.Text = request.Text;
            quote.Author = request.Author;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote is null)
            {
                return NotFound();
            }

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
