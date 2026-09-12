# BookMarked

A responsive full-stack application for managing a shared book collection and private favorite quotes. Built with Angular 20, .NET 9, and Azure SQL.

## Live Demo

[Open BookMarked](https://bookmarked-api-dani-bqcqene2e6bnhkcv.swedencentral-01.azurewebsites.net)

> Free Azure services may take up to 60 seconds to wake on the first request.

## Highlights

- Complete CRUD functionality for books and quotes
- JWT registration and authentication
- Private, user-specific quote collections
- Protected Angular routes and API endpoints
- Responsive Bootstrap interface and mobile navigation
- Persistent light and dark themes
- Reusable confirmation modals
- Reactive Forms with clear validation feedback
- Per-IP rate limiting and stricter authentication limits
- Automated Azure deployment through GitHub Actions

## Technology

| Area     | Technology                                             |
| -------- | ------------------------------------------------------ |
| Frontend | Angular 20, TypeScript, Reactive Forms, Angular Router |
| Styling  | Bootstrap 5, Font Awesome 6, SCSS                      |
| Backend  | ASP.NET Core Web API, .NET 9, C#                       |
| Data     | Entity Framework Core, SQL Server, Azure SQL           |
| Security | JWT, password hashing, authorization, rate limiting    |
| DevOps   | Azure App Service, GitHub Actions, OIDC                |

## How It Works

```text
Angular client → ASP.NET Core API → Entity Framework Core → SQL Server
```

Angular stores the JWT after login and attaches it to protected API requests through an HTTP interceptor. Books are shared between authenticated users, while quote ownership is enforced using the authenticated user's ID.

In production, Angular is compiled during `dotnet publish` and served by ASP.NET Core, allowing the client and API to share one Azure App Service deployment.

## Run Locally

### Requirements

- .NET 9 SDK
- Node.js and npm
- SQL Server
- EF Core tools

```powershell
git clone https://github.com/danitechworks/BookMarked.git
cd BookMarked
dotnet restore
cd client
npm install
cd ..
```

Configure the database connection, JWT signing key, and optional seed passwords using .NET user secrets. Then apply migrations and start the API:

```powershell
dotnet ef database update
dotnet run
```

Start Angular in a second terminal:

```powershell
cd client
npm start
```

Open `http://localhost:4200`. Swagger is available from the backend development URL at `/swagger`.

## Security and Deployment

Passwords are hashed before storage, CRUD endpoints require JWT authorization, and users can access only their own quotes. API rate limiting rejects excessive traffic with HTTP `429`.

GitHub Actions uses OIDC to build and deploy the combined application to Azure App Service. Production secrets remain in Azure configuration and are not committed to Git.

## Demo and Testing

Visitors can register their own account to explore the application. Demo credentials may also be shared privately; passwords and production secrets are intentionally excluded from this repository.

Book and quote CRUD, authentication, responsive layouts, mobile navigation, and both color themes have been tested locally and against the deployed application. Thanks to external testers [Magnus Callenholm](https://callenholm.dev/) and [Lina Samuelsson](https://www.linkedin.com/in/lina-samuelsson-09216846/) for their feedback.

## Author

Created by [Dannell Bayer](https://dannellbayer.com). Find more work on [GitHub](https://github.com/danitechworks), [LinkedIn](https://www.linkedin.com/in/dannell-bayer), and [YouTube](https://www.youtube.com/@DanisITdesk).
