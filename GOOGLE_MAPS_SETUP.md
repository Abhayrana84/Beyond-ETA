# SafeNavigation - Google Maps API Setup Guide

## Overview
The SafeNavigation dashboard now integrates Google Maps API to display an interactive map with route markers.

## Installation Complete ✅
- `@react-google-maps/api` package installed
- Dashboard updated with GoogleMap component
- Styled-components styling maintained

## Setup Steps

### 1. Get Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Directions API** (for route calculations)
   - **Geocoding API** (for location search)

### 2. Create API Key
1. In Google Cloud Console, go to **Credentials**
2. Click **Create Credentials** → **API Key**
3. Copy the generated API key

### 3. Set Application Restrictions
1. In **API Key** settings, set restriction type to **HTTP referrers (web sites)**
2. Add these referrers:
   ```
   http://localhost:3000/*
   http://localhost:3001/*
   http://localhost:3002/*
   http://localhost:3003/*
   http://yourdomain.com/*
   ```

### 4. Configure Environment Variable
Replace the API key in `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
```

### 5. Restart Dev Server
```bash
npm run dev
```

## Map Features

### Current Implementation
- **Dark Theme Styling**: Matches SafeNavigation's dark aesthetic
- **Start Location Marker**: Cyan colored marker (default: Delhi, India)
- **End Location Marker**: Red colored marker (default: different Delhi location)
- **Zoom Level**: 12 (city-level)
- **API Load Handling**: Graceful fallback UI if API key missing

### Usage in Dashboard
The map automatically loads when:
- Page renders with Google Maps API key configured
- Accepts startLocation and endLocation from Zustand store
- Will support dynamic marker positioning in future updates

### Marker Icons
- **Start**: Cyan (#06b6d4) - indicates origin/starting point
- **Destination**: Red (#ef4444) - indicates destination/end point
- **Styled**: Custom SVG path markers with white outline

## Future Enhancements
- [ ] Dynamic marker positioning from form inputs
- [ ] Route polyline visualization
- [ ] Distance and duration calculation
- [ ] Traffic layer overlay
- [ ] Street view integration
- [ ] Drag-and-drop waypoint placement

## Troubleshooting

### Map Not Showing
**Issue**: "Google Maps Setup Required" message
- **Solution**: Check `.env.local` file has `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` set

### "Refused to load the script"
- **Solution**: Verify API key is valid and has Maps JavaScript API enabled

### "This API project is not authorized"
- **Solution**: Check application restrictions match your localhost URL or domain

### Markers Not Appearing
- **Solution**: Ensure Maps JavaScript API is enabled in Google Cloud Console

## API Costs
- Maps JavaScript API: $7 per 1000 loads (first 28,000 free per month)
- Directions API: $5-17 per 1000 requests (first 25,000 free)
- Geocoding API: $5 per 1000 requests (first 25,000 free)

Monitor usage in Google Cloud Console → Billing

## Files Modified
- `app/dashboard.tsx` - Updated MapContainer component with GoogleMap
- `.env.local` - Added API key configuration

## Testing
```bash
# Dev server
npm run dev

# Production build
npm run build

# Test on localhost:3002
# (or 3001/3000 if 3002 is unavailable)
```

## Support
For more information:
- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [React Google Maps Documentation](https://react-google-maps-api-docs.netlify.app/)
