Write-Host "🚀 Deploying Titan ESG Backend to Heroku..." -ForegroundColor Green

Write-Host ""
Write-Host "📦 Building the application..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "🔐 Logging into Heroku..." -ForegroundColor Yellow
heroku login

Write-Host ""
Write-Host "🏗️  Creating Heroku app (if it doesn't exist)..." -ForegroundColor Yellow
heroku create titan-esg-backend --buildpack heroku/nodejs

Write-Host ""
Write-Host "⚙️  Setting environment variables..." -ForegroundColor Yellow
heroku config:set NODE_ENV=production
heroku config:set PORT=3000

Write-Host ""
Write-Host "📤 Pushing to Heroku..." -ForegroundColor Yellow
git add .
git commit -m "Deploy to Heroku"
git push heroku main

Write-Host ""
Write-Host "🌐 Opening the deployed app..." -ForegroundColor Yellow
heroku open

Write-Host ""
Write-Host "✅ Deployment complete! Your app is now live on Heroku." -ForegroundColor Green
Write-Host "📍 App URL: https://titan-esg-backend.herokuapp.com" -ForegroundColor Cyan
Write-Host "📚 API Docs: https://titan-esg-backend.herokuapp.com/api" -ForegroundColor Cyan
