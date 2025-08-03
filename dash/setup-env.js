const fs = require('fs');
const path = require('path');

const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/todos_db"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with template values');
  console.log('⚠️  Please update the .env file with your actual values:');
  console.log('   - DATABASE_URL: Your PostgreSQL connection string');
  console.log('   - NEXT_PUBLIC_SUPABASE_URL: Your Supabase project URL');
  console.log('   - NEXT_PUBLIC_SUPABASE_ANON_KEY: Your Supabase anon key');
  console.log('   - SUPABASE_SERVICE_ROLE_KEY: Your Supabase service role key');
} else {
  console.log('✅ .env file already exists');
} 