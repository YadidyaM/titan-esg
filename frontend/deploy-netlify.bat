@echo off
echo 🌐 Deploying Titan ESG Frontend to Netlify...

echo.
echo 📦 Building the application for production...
npm run build:netlify

echo.
echo 🔐 Logging into Netlify...
netlify login

echo.
echo 🏗️  Initializing Netlify site (if not already done)...
netlify init

echo.
echo 📤 Deploying to Netlify...
netlify deploy --prod --dir=out

echo.
echo 🌐 Opening the deployed site...
netlify open:site

echo.
echo ✅ Deployment complete! Your site is now live on Netlify.
echo 📍 Site URL: Check the Netlify dashboard for your site URL
