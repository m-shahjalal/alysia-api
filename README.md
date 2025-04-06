# Alysia Backend

A robust NestJS-based backend application for managing e-commerce operations including inventory, products, customers, and marketing.

## Features

- **Authentication & Authorization**: JWT-based authentication with refresh token support
- **User Management**: Role-based access control and user administration
- **Product Management**: Comprehensive product catalog management
- **Inventory Management**: Track and manage product inventory
- **Customer Management**: Customer data and relationship management
- **Storefront**: E-commerce storefront management
- **Marketing**: Marketing campaign and promotion management

## Tech Stack

- **Framework**: NestJS v11
- **Database**: PostgreSQL with TypeORM
- **Authentication**: Passport.js with JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker

## Prerequisites

- Node.js (LTS version)
- PNPM package manager
- Docker and Docker Compose
- PostgreSQL

## Installation

```bash
# Install dependencies
pnpm install
```

## Environment Setup

Copy the example environment file and update it with your configuration:

```bash
cp .env.example .env
```

Key environment variables:

- `APP_PORT`: Application port (default: 4000)
- `APP_ENV`: Environment (development/production)
- `DB_HOST`: Database host
- `DB_PORT`: Database port
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASS`: Database password

## Development

```bash
# Start development server
pnpm dev

# Run in debug mode
pnpm debug

# Build the application
pnpm build

# Run linting
pnpm lint

# Format code
pnpm format
```

## Database Management

```bash
# Generate migration
pnpm db:mi:generate

# Run migration
pnpm db:mi:run

# Revert migration
pnpm db:mi:revert

# Run seeds
pnpm db:seed

# Database backup
pnpm db:backup

# Database restore
pnpm db:restore
```

## Docker Deployment

The application includes Docker configuration for easy deployment:

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

Services included:

- Backend API (NestJS application)
- PostgreSQL database
- Adminer (Database management UI)

## Documentation

```bash
# Generate documentation
pnpm doc:generate

# Serve documentation
pnpm doc:serve
```

Access the API documentation at `http://localhost:4000/api`

## Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## Project Structure

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication
│   ├── users/        # User management
│   ├── products/     # Product management
│   ├── inventory/    # Inventory management
│   ├── customers/    # Customer management
│   ├── storefront/   # Storefront management
│   └── marketing/    # Marketing management
├── common/           # Shared resources
├── config/           # Configuration
└── database/         # Database migrations and seeds
```

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

UNLICENSED
