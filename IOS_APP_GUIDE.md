# iOS Mobile App Conversion - Complete Guide

## Overview

The AHU Opportunity Tracker has been successfully converted to an iOS mobile app using React Native and Expo. The mobile app is located in the `ios-app/` directory.

## What Was Created

### Project Structure
```
ios-app/
├── App.tsx                 # Main app with navigation setup
├── screens/                # Screen components
│   ├── HomeScreen.tsx             # Opportunities list view
│   ├── OpportunityDetailScreen.tsx # Edit opportunity
│   └── NewOpportunityScreen.tsx    # Create new opportunity
├── components/             # Reusable UI components
│   ├── OpportunityCard.tsx        # Card component for list view
│   ├── StatusBadge.tsx            # Status indicator badges
│   └── PriorityBadge.tsx          # Priority indicator badges
├── lib/
│   └── supabase.ts               # Supabase client configuration
├── types/
│   └── opportunity.ts            # TypeScript type definitions
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (configure this!)
└── README.md              # Detailed setup and usage instructions
```

### Features Implemented

1. **Home Screen**
   - Scrollable list of all opportunities
   - Pull-to-refresh functionality
   - Tap to view/edit opportunities
   - Delete opportunities with confirmation
   - Create new opportunity button

2. **Opportunity Detail Screen**
   - Edit all opportunity fields
   - Interactive status and priority selection
   - Save changes with validation
   - Auto-update to Supabase backend

3. **New Opportunity Screen**
   - Form to create new opportunities
   - Required field validation
   - All fields from the original web app

4. **Components**
   - Status badges with icons (New, Qualified, Assessing, etc.)
   - Priority badges (Low, Medium, High)
   - Opportunity cards with formatted data
   - Native iOS styling and interactions

## How to Test

### Option 1: On Your Mac with iOS Simulator (Recommended)

1. **Prerequisites**
   - macOS with Xcode installed
   - iOS Simulator set up

2. **Setup**
   ```bash
   cd ios-app
   npm install

   # Configure .env file with your Supabase credentials
   cp .env.example .env
   # Edit .env and add your EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY
   ```

3. **Run**
   ```bash
   npm run ios
   ```
   This will open the iOS Simulator and launch the app.

### Option 2: On Physical iOS Device

1. **Install Expo Go**
   - Download "Expo Go" from the App Store on your iPhone/iPad

2. **Start the development server**
   ```bash
   cd ios-app
   npm install
   # Configure .env first!
   npm start
   ```

3. **Connect**
   - Scan the QR code with your iPhone camera
   - The app will open in Expo Go

### Option 3: Web Browser (Testing Only)

You can test the app in a web browser (though it's designed for mobile):

```bash
cd ios-app
npm install
# Configure .env first!
npm run web
```

Then open `http://localhost:19006` in your browser.

## Important Configuration

### Environment Variables

You **must** configure the `.env` file before running the app:

```bash
cd ios-app
nano .env
```

Add your Supabase credentials:
```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your Supabase project:
- Dashboard → Project Settings → API
- Copy the "Project URL" and "anon/public" key

### Database Setup

Make sure your Supabase database has the `opportunities` table set up. See the main README.md for the SQL schema.

## Building for Production

### Using EAS Build (Works on Any Platform)

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Local Build (macOS Only)

```bash
cd ios-app
npm run ios
# Then use Xcode to build and distribute
```

## Key Differences from Web App

1. **Navigation**: Uses React Navigation instead of Next.js routing
2. **Styling**: Uses React Native StyleSheet instead of Tailwind CSS classes
3. **Components**: Native components (View, Text, TouchableOpacity) instead of HTML
4. **Icons**: React Native SVG instead of inline SVG
5. **Forms**: Native TextInput with mobile-optimized keyboards
6. **Interactions**: Touch-based instead of mouse/click

## Features Preserved

- ✅ All opportunity fields from the original app
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Status and priority management
- ✅ Real-time sync with Supabase
- ✅ Data validation
- ✅ Error handling
- ✅ Responsive design for different screen sizes

## Next Steps

1. **Test on a device** - Install Expo Go and test the app
2. **Customize styling** - Adjust colors and layouts in the screen files
3. **Add features**:
   - Search and filtering
   - Sorting options
   - Offline support
   - Push notifications
   - Image uploads
4. **Deploy** - Use EAS Build to create production builds

## Troubleshooting

### "Missing environment variables" error
- Make sure `.env` file exists and has valid Supabase credentials
- Restart the development server after changing `.env`

### "Could not find the table" error
- Check that your Supabase database has the `opportunities` table
- Verify the RLS policies allow anonymous access (for development)

### App won't start
- Try clearing the cache: `expo start -c`
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Icons not showing
- `react-native-svg` should be installed automatically
- If issues persist, run: `npm install react-native-svg`

## Support

For more details, see:
- `ios-app/README.md` - Detailed documentation
- Expo documentation: https://docs.expo.dev
- React Navigation: https://reactnavigation.org
- Supabase docs: https://supabase.com/docs

---

**Created**: January 2026
**Framework**: React Native with Expo
**Backend**: Supabase
**Platforms**: iOS, Android (iOS optimized)
