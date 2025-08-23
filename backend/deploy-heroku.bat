@echo off
echo 🚀 Deploying Titan ESG Backend to Heroku...

echo.
echo 📦 Building the application...
npm run build

echo.
echo 🔐 Logging into Heroku...
heroku login

echo.
echo 🏗️  Creating Heroku app (if it doesn't exist)...
heroku create titan-esg-backend --buildpack heroku/nodejs

echo.
echo ⚙️  Setting environment variables...
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

echo.
echo 📤 Pushing to Heroku...
git add .
git commit -m "Deploy to Heroku"
git push heroku main

echo.
echo 🌐 Opening the deployed app...
heroku open

echo.
echo ✅ Deployment complete! Your app is now live on Heroku.
echo 📍 App URL: https://titan-esg-backend.herokuapp.com
echo 📚 API Docs: https://titan-esg-backend.herokuapp.com/api
