using BookMarked.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BookMarked.Data
{
    public class DataInitializer
    {
        private readonly AppDbContext _context;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IConfiguration _configuration;

        public DataInitializer(
            AppDbContext context,
            IPasswordHasher<User> passwordHasher,
            IConfiguration configuration)
        {
            _context = context;
            _passwordHasher = passwordHasher;
            _configuration = configuration;
        }

        public async Task InitializeAsync()
        {
            var testUser = await EnsureUserAsync(
                "testuser",
                "Seed:TestUserPassword");

            var secondUser = await EnsureUserAsync(
                "seconduser",
                "Seed:SecondUserPassword");

            await SeedBooksAsync();
            await SeedQuotesAsync(testUser);
            await SeedQuotesAsync(secondUser);

            await _context.SaveChangesAsync();
        }

        private async Task<User> EnsureUserAsync(
            string username,
            string passwordSetting)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(user => user.Username == username);

            if (user is not null)
            {
                return user;
            }

            var password = _configuration[passwordSetting];

            if (string.IsNullOrWhiteSpace(password))
            {
                throw new InvalidOperationException(
                    $"Missing seed password setting: {passwordSetting}");
            }

            user = new User
            {
                Username = username
            };

            user.PasswordHash = _passwordHasher.HashPassword(user, password);

            _context.Users.Add(user);

            return user;
        }

        private async Task SeedBooksAsync()
        {
            var books = new List<Book>
            {
                new()
                {
                    Title = "A Game of Thrones",
                    Author = "George R. R. Martin",
                    PublicationDate = new DateOnly(1996, 8, 6)
                },
                new()
                {
                    Title = "Sacajawea",
                    Author = "Anna Lee Waldo",
                    PublicationDate = new DateOnly(1979, 5, 1)
                },
                new()
                {
                    Title = "The Handmaid's Tale",
                    Author = "Margaret Atwood",
                    PublicationDate = new DateOnly(1986, 2, 17)
                }
            };

            foreach (var book in books)
            {
                var exists = await _context.Books.AnyAsync(existing =>
                    existing.Title == book.Title &&
                    existing.Author == book.Author);

                if (!exists)
                {
                    _context.Books.Add(book);
                }
            }
        }

        private async Task SeedQuotesAsync(User user)
        {
            var quotes = new List<Quote>
            {
                new()
                {
                    Text = "I am the master of my fate: I am the captain of my soul.",
                    Author = "William Ernest Henley"
                },
                new()
                {
                    Text = "Although the world is full of suffering, it is full also of the overcoming of it.",
                    Author = "Helen Keller"
                },
                new()
                {
                    Text = "Nothing is at last sacred but the integrity of your own mind.",
                    Author = "Ralph Waldo Emerson"
                },
                new()
                {
                    Text = "Hope is the thing with feathers",
                    Author = "Emily Dickinson"
                },
                new()
                {
                    Text = "Still achieving, still pursuing, Learn to labor and to wait.",
                    Author = "Henry Wadsworth Longfellow"
                }
            };


            foreach (var quote in quotes)
            {
                var exists = user.Id != 0 &&
                    await _context.Quotes.AnyAsync(existing =>
                        existing.UserId == user.Id &&
                        existing.Text == quote.Text &&
                        existing.Author == quote.Author);

                if (!exists)
                {
                    quote.User = user;
                    _context.Quotes.Add(quote);
                }
            }
        }
    }
}
