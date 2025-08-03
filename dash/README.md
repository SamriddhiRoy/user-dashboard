# GGTodo Dashboard

A modern, full-featured todo dashboard built with Next.js 15, featuring authentication, role management, and real-time notifications.

## Features

- 🔐 **Authentication**: Google OAuth and email/password login via Supabase
- 👥 **Role Management**: Normal users and superusers with different permissions
- ✅ **Todo Management**: Full CRUD operations with date/time validation
- 🔔 **Notifications**: Real-time drawer showing upcoming and completed todos
- 👤 **Profile Management**: User profile editing and avatar management
- 🛡️ **Admin Panel**: User management interface for superusers
- 📱 **Responsive Design**: Modern UI that works on all devices
- 🐳 **Docker Ready**: Fully containerized for easy deployment

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS, Lucide React icons
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth
- **Date Handling**: date-fns
- **Deployment**: Docker with multi-stage builds

## Project Structure

```
dash/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── server/                # Database schema and utilities
├── public/                # Static assets
├── Dockerfile            # Docker configuration
├── docker-compose.yml    # Docker Compose setup
└── README.md             # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (or use Docker)
- Supabase project for authentication

### Method 1: Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd dash
   npm install
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/todos_db"
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```

3. **Setup database**
   ```bash
   # Generate migrations
   npm run generate
   
   # Run migrations
   npm run migrate
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:3000
   - Register a new account or login with Google
   - The first user will be a normal user by default

### Method 2: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dash
   ```

2. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your Supabase credentials.

3. **Run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Run database migrations**
   ```bash
   # In a new terminal, exec into the app container
   docker exec -it todo-app npm run migrate
   ```

5. **Access the application**
   - Open http://localhost:3000
   - The PostgreSQL database will be available on localhost:5432

## Creating the First Superuser

Since the first user is created as a "normal user" by default, you'll need to manually promote them to superuser:

### Option 1: Database Direct Access
```sql
UPDATE users SET role = 'superuser' WHERE email = 'your-email@example.com';
```

### Option 2: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to Table Editor > users
3. Find your user record
4. Change the `role` field from 'normal' to 'superuser'

## Authentication Setup

### Supabase Configuration

1. **Create a Supabase project** at https://supabase.com

2. **Configure Authentication**
   - Go to Authentication > Settings
   - Enable Email authentication
   - Configure Google OAuth (optional):
     - Add Google as a provider
     - Add your domain to redirect URLs

3. **Database Setup**
   - The application will create its own user table
   - Supabase Auth handles authentication
   - Our custom table handles roles and additional user data

### Google OAuth Setup (Optional)

1. **Google Cloud Console**
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

2. **Supabase Configuration**
   - Add Google OAuth credentials to your Supabase project
   - Configure redirect URLs

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Todos
- `GET /api/todos` - List user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/[id]` - Update todo
- `PATCH /api/todos/[id]` - Toggle todo completion
- `DELETE /api/todos/[id]` - Delete todo
- `GET /api/todos/notifications` - Get notification todos

### Users (Superuser only)
- `GET /api/users` - List all users
- `PATCH /api/users/[id]/role` - Update user role

### Profile
- `PUT /api/profile` - Update user profile

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Features Guide

### Todo Management
- **Create Todo**: Click "New Todo" button, fill form with title, description, and future date/time
- **Edit Todo**: Click edit icon on any todo item
- **Complete Todo**: Click the circle icon to mark as complete
- **Delete Todo**: Click trash icon (with confirmation)
- **Validation**: All todos must be scheduled for future date/time

### Notifications
- **Access**: Click bell icon in top navigation
- **Upcoming**: Shows todos due in next 4 hours
- **Completed**: Shows recently completed todos
- **Real-time**: Updates automatically when todos change

### User Management (Superusers Only)
- **Access**: Available in sidebar for superusers
- **View Users**: See all registered users with statistics
- **Toggle Roles**: Switch users between normal and superuser
- **Restrictions**: Cannot change your own role

### Profile Management
- **View Profile**: Access via sidebar navigation
- **Edit Information**: Update name and email
- **Avatar**: Shows first letter of name/email (avatar upload ready for future enhancement)
- **Account Info**: View role, verification status, and join date

## Deployment

### Docker Production Deployment

1. **Build production image**
   ```bash
   docker build -t ggtodo-dashboard .
   ```

2. **Run with environment variables**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-production-db-url" \
     -e NEXT_PUBLIC_SUPABASE_URL="your-supabase-url" \
     -e NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-key" \
     ggtodo-dashboard
   ```

### Cloud Deployment

The application is ready to deploy to:
- **Vercel**: Native Next.js support
- **Netlify**: With adapter
- **Railway**: Docker deployment
- **DigitalOcean App Platform**: Docker deployment
- **AWS ECS/Fargate**: Container deployment

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | No |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | No |
| `NEXTAUTH_URL` | Application URL | No* |
| `NEXTAUTH_SECRET` | NextAuth secret key | No* |

*Required if using NextAuth instead of Supabase Auth

## Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run generate     # Generate database migrations
npm run migrate      # Run database migrations
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify DATABASE_URL format
   - Ensure PostgreSQL is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify Supabase configuration
   - Check environment variables
   - Ensure redirect URLs are correct

3. **Build Errors**
   - Clear `.next` folder and rebuild
   - Verify all dependencies are installed
   - Check TypeScript errors

4. **Docker Issues**
   - Ensure Docker is running
   - Check port conflicts
   - Verify environment variables in docker-compose.yml

### Getting Help

1. Check the browser console for client-side errors
2. Check application logs for server-side errors
3. Verify database migrations have run
4. Ensure all environment variables are set correctly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**


