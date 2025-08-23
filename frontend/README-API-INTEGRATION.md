# ESG Dashboard - Dynamic API Integration

## Overview

The ESG Dashboard has been completely transformed from static mock data to a fully dynamic system that integrates with real government APIs for Energy Performance Certificates (EPC) and Property Data.

## Environment Setup

### 1. Create Environment File

Create a `.env` file in your `frontend` directory with the following variables:

```bash
# API Keys
EPC_KEY=32c3c4979f4bf02ea00be456a3b840ec272dca44
PROPERTY_DATA_API_KEY=RPEMJFQNOR
USE_LAND_PROPERTY_API_KEY=a84446ee-20b8-49e2-b618-d7a67075897

# Next.js Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Settings
EPC_API_RATE_LIMIT=100
PROPERTY_API_RATE_LIMIT=50
API_TIMEOUT=10000
API_RETRY_ATTEMPTS=3

# Development
DEBUG=true
SHOW_API_RESPONSES=true
```

### 2. Environment File Template

A complete `env.sample` file is provided in the project root with all available configuration options.

### 3. Security Notes

- **Never commit your `.env` file to version control**
- **Keep your API keys secure and rotate them regularly**
- **Use different keys for development and production**

## API Integration

### 1. EPC (Energy Performance Certificate) API
- **Base URL**: `https://epc.opendatacommunities.org/api/v1`
- **Authentication**: Public API, no key required
- **Data**: Real-time energy performance data for UK properties
- **Rate Limit**: 100 requests per minute

### 2. Property Data API
- **Base URL**: `https://api.propertydata.co.uk/v1`
- **API Key**: Required for authentication
- **Data**: Comprehensive property information including valuations, council tax, and demographics
- **Rate Limit**: 50 requests per minute

## Configuration

### API Keys Setup
1. **EPC API Key**: `32c3c4979f4bf02ea00be456a3b840ec272dca44`
2. **Property Data API Key**: `RPEMJFQNOR`
3. **Land Property API Key**: `a84446ee-20b8-49e2-b618-d7a67075897`

### Environment Variables (Production)
```bash
EPC_KEY=your_epc_api_key_here
PROPERTY_DATA_API_KEY=your_property_data_api_key_here
USE_LAND_PROPERTY_API_KEY=your_land_property_api_key_here
```

## Features

### 1. Real-Time Property Search
- Search any UK postcode for property data
- Instant EPC ratings and energy efficiency scores
- Live property valuations and council tax information
- Real-time ESG scoring based on actual data

### 2. Dynamic Data Loading
- No more static mock data
- All data fetched from live APIs
- Automatic error handling and retry logic
- Rate limiting and timeout management

### 3. ESG Score Calculation
- **Energy Rating**: 40% weight (A=100, B=85, C=70, etc.)
- **CO2 Emissions**: 30% weight (lower emissions = higher score)
- **Energy Consumption**: 30% weight (lower consumption = higher score)

### 4. Data Quality Assessment
- Automatic data completeness scoring
- Real-time compliance assessment
- Sustainability rating calculation
- Data source validation

## API Endpoints

### EPC Data
```
GET /domestic/search?postcode={postcode}&size=100
Headers: Accept: application/json
```

### Property Data
```
GET /postcodes/{postcode}
Headers: Authorization: Bearer {PROPERTY_DATA_API_KEY}
```

## Error Handling

### Common API Errors
1. **Invalid API Key**: Check your API keys in the configuration
2. **Rate Limiting**: Wait for rate limit window to reset
3. **Network Issues**: Check internet connectivity
4. **Service Maintenance**: API service may be temporarily unavailable

### User Feedback
- Clear error messages with troubleshooting tips
- Automatic retry functionality
- Graceful fallback for failed requests
- Real-time status indicators

## Usage Examples

### Search for a Property
1. Navigate to ESG Data Hub → Property Search tab
2. Enter a UK postcode (e.g., SW1A 1AA, CB4 1DF)
3. Click "Search" to fetch real-time data
4. View EPC ratings, property details, and ESG scores

### View ESG Datasets
1. Navigate to ESG Data Hub → ESG Datasets tab
2. Browse dynamically generated datasets
3. Filter by category (Environmental, Social, Governance)
4. Click "View Data" to explore detailed information

## Data Transformation

### EPC Data Mapping
- Raw API response → Structured EPCData interface
- Automatic fallback values for missing data
- Data validation and sanitization
- Consistent formatting across all properties

### Property Data Mapping
- Raw API response → Structured PropertyData interface
- Coordinate extraction and formatting
- Value formatting and currency display
- Historical data preservation

## Performance Optimization

### Caching Strategy
- API response caching (5-minute TTL)
- Rate limit tracking
- Request deduplication
- Background data refresh

### Loading States
- Skeleton loaders during API calls
- Progress indicators for long operations
- Optimistic UI updates
- Error boundary protection

## Security Considerations

### API Key Protection
- Keys stored in configuration files (not in client code)
- Environment variable support for production
- No hardcoded secrets in public repositories
- Regular key rotation recommended

### Data Privacy
- No personal information stored locally
- API responses processed in real-time
- Secure HTTPS connections only
- GDPR compliance for UK data

## Troubleshooting

### API Connection Issues
1. Verify API keys are correct
2. Check network connectivity
3. Ensure API service is operational
4. Review rate limiting status

### Data Display Issues
1. Check browser console for errors
2. Verify API response format
3. Clear browser cache
4. Refresh the application

### Performance Issues
1. Monitor API response times
2. Check rate limiting status
3. Review network conditions
4. Optimize search queries

## Future Enhancements

### Planned Features
1. **Batch Processing**: Multiple postcode searches
2. **Data Export**: CSV/PDF reports
3. **Historical Tracking**: Property data changes over time
4. **Advanced Analytics**: Machine learning insights
5. **Mobile Optimization**: Responsive design improvements

### API Expansion
1. **Additional Data Sources**: More government APIs
2. **International Support**: Non-UK properties
3. **Real-time Updates**: WebSocket connections
4. **Offline Support**: Progressive web app features

## Support

For technical support or API integration questions:
1. Check the browser console for error details
2. Review API documentation for endpoint changes
3. Verify API key validity and permissions
4. Contact the development team for assistance

---

**Note**: This system is designed for demonstration and development purposes. For production use, ensure proper API key management, rate limiting, and error handling are implemented according to your specific requirements.
