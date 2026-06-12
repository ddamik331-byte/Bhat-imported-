# Bhat Importer Clothes - Deployment Guide

This guide covers how to deploy the Bhat Importer Clothes website to Vercel and set up GitHub integration.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Node.js 18+ and pnpm installed locally

## Local Development

### 1. Clone the Repository

```bash
git clone <your-github-repo-url>
cd bhat-importer-clothes
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret_key
VITE_APP_ID=your_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=your_owner_open_id
OWNER_NAME=Your Name
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_backend_api_key
BUILT_IN_FORGE_API_URL=https://api.manus.im
```

### 4. Run Development Server

```bash
pnpm dev
```

The site will be available at `http://localhost:3000`

### 5. Build for Production

```bash
pnpm build
```

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

### Option 2: GitHub Integration (Recommended)

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit: Bhat Importer Clothes"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Vercel will auto-detect the project settings
   - Add environment variables in the "Environment Variables" section
   - Click "Deploy"

3. **Automatic Deployments**

   - Every push to `main` branch will trigger a new deployment
   - Preview deployments are created for pull requests

## Admin Panel Access

### Default Admin Credentials

- **Username**: `admin`
- **Password**: `password123`

**Important**: Change these credentials immediately after first login!

### Accessing Admin Panel

1. Click the "Admin" button in the top-right navigation
2. Enter your username and password
3. Manage products (add, edit, delete)

## Product Management

### Adding Products

1. Log in to the admin panel
2. Click "Add New Product"
3. Fill in the product details:
   - **Product Name**: Name of the item
   - **Price**: Price in USD
   - **Category**: Product category (e.g., "Shirts", "Dresses")
   - **Description**: Product description
   - **Image URL**: URL to the product image
4. Click "Add Product"

### Editing Products

1. Find the product in the list
2. Click the "Edit" button
3. Update the details
4. Click "Update Product"

### Deleting Products

1. Find the product in the list
2. Click the "Delete" button
3. Confirm the deletion

## Database Setup

The application uses MySQL/TiDB. Make sure your database connection string is properly configured in the environment variables.

### Schema Migration

The database schema is automatically managed through Drizzle ORM. Migrations are applied during deployment.

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL/TiDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `VITE_APP_ID` | OAuth application ID | Yes |
| `OAUTH_SERVER_URL` | OAuth server base URL | Yes |
| `VITE_OAUTH_PORTAL_URL` | OAuth portal URL for frontend | Yes |
| `OWNER_OPEN_ID` | Owner's unique identifier | Yes |
| `OWNER_NAME` | Owner's display name | Yes |
| `VITE_FRONTEND_FORGE_API_KEY` | Frontend API key | Yes |
| `VITE_FRONTEND_FORGE_API_URL` | Frontend API URL | Yes |
| `BUILT_IN_FORGE_API_KEY` | Backend API key | Yes |
| `BUILT_IN_FORGE_API_URL` | Backend API URL | Yes |

## Troubleshooting

### Build Fails on Vercel

- Check that all environment variables are set correctly
- Ensure `pnpm-lock.yaml` is committed to the repository
- Clear Vercel cache and redeploy

### Database Connection Issues

- Verify the `DATABASE_URL` format is correct
- Check database credentials
- Ensure the database server is accessible from Vercel

### Admin Login Not Working

- Verify the admin user exists in the database
- Check that credentials are correct (default: `admin` / `password123`)
- Check browser console for error messages

## Security Recommendations

1. **Change Default Admin Credentials**: Update the admin password immediately after first login
2. **Use HTTPS**: Always use HTTPS in production (Vercel provides this by default)
3. **Environment Variables**: Never commit `.env` files to version control
4. **Database**: Use strong database passwords and restrict access
5. **API Keys**: Rotate API keys regularly

## Performance Optimization

- Images are served from CDN
- Static assets are cached
- Database queries are optimized
- Frontend is built with React and Tailwind CSS for optimal performance

## Support

For issues or questions, refer to the project documentation or contact support.

## License

This project is proprietary and confidential.
