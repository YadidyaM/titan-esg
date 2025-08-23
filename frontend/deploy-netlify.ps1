Write-Host "🌐 Deploying Titan ESG Frontend to Netlify..." -ForegroundColor Green

Write-Host ""
Write-Host "📦 Building the application for production..." -ForegroundColor Yellow
npm run build:netlify

Write-Host ""
Write-Host "🔐 Logging into Netlify..." -ForegroundColor Yellow
netlify login

Write-Host ""
Write-Host "🏗️  Initializing Netlify site (if not already done)..." -ForegroundColor Yellow
netlify init

Write-Host ""
Write-Host "📤 Deploying to Netlify..." -ForegroundColor Yellow
netlify deploy --prod --dir=out

Write-Host ""
Write-Host "🌐 Opening the deployed site..." -ForegroundColor Yellow
netlify open:site

Write-Host ""
Write-Host "✅ Deployment complete! Your site is now live on Netlify." -ForegroundColor Green
Write-Host "📍 Site URL: Check the Netlify dashboard for your site URL" -ForegroundColor Cyan
