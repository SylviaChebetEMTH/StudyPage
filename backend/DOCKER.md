# Docker Setup for StudyPage Backend

## Quick Start

### Production (using docker-compose)
```bash
docker-compose up -d
```

### Development
```bash
docker-compose -f ../docker-compose.yml -f docker-compose.dev.yml up
```

## Manual Build & Run

### Build the image
```bash
docker build -t studypage-backend:latest .
```

### Run container
```bash
docker run -p 5000:5000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/db \
  -e JWT_SECRET_KEY=your-secret-key \
  studypage-backend:latest
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET_KEY` - Secret for JWT tokens

Optional:
- `FLASK_ENV` - Set to `production` or `development`
- `DEPLOY` - Set to `true` to run data seeding
- `ADMIN_EMAIL` - Admin user email

## Benefits

1. **Consistency**: Same environment everywhere
2. **Portability**: Run on any Docker-compatible platform
3. **Isolation**: Dependencies won't conflict
4. **Scalability**: Easy to scale horizontally

## When NOT to Use Docker

- ✅ Your current Render setup works fine
- ✅ You're not switching platforms
- ✅ Team is small and experienced with Python
- ✅ Deployment is stable and simple

## Recommendations

**Use Docker if:**
- You want local dev environment matching production
- You plan to move off Render
- You have multiple developers
- You want to test locally with PostgreSQL

**Skip Docker if:**
- Render deployment works well (current situation)
- You're the only developer
- You don't need local database testing
- Time is better spent on features

