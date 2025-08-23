# 🚀 Titan ESG Platform Deployment Guide

This guide will help you deploy the Titan ESG Platform to Heroku (Backend) and Netlify (Frontend).

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/) installed and configured
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installed
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) installed
- GitHub account with your repository

## 🔧 Backend Deployment (Heroku)

### 1. Prepare the Backend

```bash
cd backend
npm install
```

### 2. Deploy to Heroku

#### Option A: Using the provided script (Windows)
```bash
deploy-heroku.bat
```

#### Option B: Using the provided script (PowerShell)
```powershell
.\deploy-heroku.ps1
```

#### Option C: Manual deployment
```bash
# Login to Heroku
heroku login

# Create a new Heroku app
heroku create titan-esg-backend --buildpack heroku/nodejs

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

# Add your custom environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret
heroku config:set OPENAI_API_KEY=your-openai-api-key

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main

# Open the app
heroku open
```

### 3. Verify Backend Deployment

- Check the logs: `heroku logs --tail`
- Test the API: Visit `https://your-app-name.herokuapp.com/api`
- Check the health endpoint: `https://your-app-name.herokuapp.com/health`

## 🌐 Frontend Deployment (Netlify)

### 1. Prepare the Frontend

```bash
cd frontend
npm install
```

### 2. Update Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=https://your-heroku-app-name.herokuapp.com
```

### 3. Deploy to Netlify

#### Option A: Using the provided script (Windows)
```bash
deploy-netlify.bat
```

#### Option B: Using the provided script (PowerShell)
```powershell
.\deploy-netlify.ps1
```

#### Option C: Manual deployment
```bash
# Login to Netlify
netlify login

# Initialize Netlify (first time only)
netlify init

# Build and export the app
npm run build:netlify

# Deploy to production
netlify deploy --prod --dir=out

# Open the site
netlify open:site
```

### 4. Configure Netlify Environment Variables

In your Netlify dashboard:
1. Go to Site settings > Environment variables
2. Add: `NEXT_PUBLIC_API_URL` = `https://your-heroku-app-name.herokuapp.com`

## 🔗 Connect Frontend to Backend

### 1. Update CORS in Backend

In your Heroku app, set the CORS origin:

```bash
heroku config:set CORS_ORIGIN=https://your-netlify-site.netlify.app
```

### 2. Update Frontend API Configuration

Make sure your frontend is pointing to the correct backend URL in the environment variables.

## 📱 Testing the Deployment

### Backend Tests
```bash
# Test the API
curl https://your-heroku-app.herokuapp.com/health

# Test Swagger docs
open https://your-heroku-app.herokuapp.com/api
```

### Frontend Tests
1. Visit your Netlify site
2. Test the navigation between pages
3. Test API calls to the backend
4. Verify all features are working

## 🚨 Troubleshooting

### Common Heroku Issues

1. **Build fails**: Check the build logs with `heroku logs --tail`
2. **App crashes**: Check the runtime logs
3. **Environment variables**: Verify all required env vars are set

### Common Netlify Issues

1. **Build fails**: Check the build logs in Netlify dashboard
2. **404 errors**: Verify the `netlify.toml` configuration
3. **API calls fail**: Check CORS configuration and API URL

### Performance Issues

1. **Slow loading**: Check image optimization settings
2. **API delays**: Monitor Heroku dyno performance
3. **Build times**: Optimize dependencies and build process

## 🔄 Continuous Deployment

### GitHub Integration

1. **Netlify**: Connect your GitHub repo for automatic deployments
2. **Heroku**: Connect your GitHub repo for automatic deployments

### Environment Management

- Use different environment variables for staging/production
- Set up preview deployments for pull requests
- Monitor deployment health and performance

## 📊 Monitoring

### Heroku Monitoring
- Use Heroku Metrics to monitor app performance
- Set up alerts for errors and performance issues
- Monitor dyno usage and costs

### Netlify Monitoring
- Use Netlify Analytics for site performance
- Monitor build times and success rates
- Set up form notifications and webhooks

## 🆘 Support

If you encounter issues:

1. Check the logs: `heroku logs --tail` or Netlify build logs
2. Verify environment variables are set correctly
3. Check CORS configuration
4. Ensure all dependencies are properly installed
5. Verify the build process completes successfully

## 🎯 Next Steps

After successful deployment:

1. Set up custom domains (optional)
2. Configure SSL certificates
3. Set up monitoring and alerts
4. Implement CI/CD pipelines
5. Set up staging environments
6. Configure backup and recovery procedures

---

**Happy Deploying! 🚀**

Your Titan ESG Platform should now be live and accessible to users worldwide!
