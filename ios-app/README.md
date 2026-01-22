# AHU Opportunity Tracker - iOS Mobile App

React Native mobile app for tracking AHU (Air Handling Unit) opportunities, built with Expo.

## Features

- View all opportunities in a scrollable list
- Create new opportunities
- Edit existing opportunities
- Delete opportunities
- Real-time sync with Supabase backend
- Native iOS experience

## Tech Stack

- **React Native** - Mobile app framework
- **Expo** - Development platform
- **TypeScript** - Type safety
- **Supabase** - Backend and database
- **React Navigation** - Navigation
- **React Native SVG** - Icons

## Setup

### Prerequisites

- Node.js 18+ installed
- Expo CLI (installed automatically)
- Supabase account with the opportunities table set up

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     - `EXPO_PUBLIC_SUPABASE_URL` - Your Supabase project URL
     - `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key

3. Ensure your Supabase database has the `opportunities` table set up (see main project README for SQL schema)

## Running the App

### Web (for testing in browser)
```bash
npm run web
```

### iOS Simulator (requires macOS)
```bash
npm run ios
```

### Android Emulator
```bash
npm run android
```

### On Physical Device
1. Install the Expo Go app on your iOS/Android device
2. Run `npm start`
3. Scan the QR code with your device's camera (iOS) or Expo Go app (Android)

## Development

The app structure:

```
ios-app/
├── screens/              # Screen components
│   ├── HomeScreen.tsx           # Main opportunities list
│   ├── OpportunityDetailScreen.tsx  # Edit opportunity
│   └── NewOpportunityScreen.tsx     # Create new opportunity
├── components/           # Reusable components
│   ├── OpportunityCard.tsx  # Opportunity card component
│   ├── StatusBadge.tsx      # Status badge
│   └── PriorityBadge.tsx    # Priority badge
├── lib/                  # Utilities
│   └── supabase.ts          # Supabase client setup
├── types/                # TypeScript types
│   └── opportunity.ts       # Opportunity type definitions
├── App.tsx               # Main app component with navigation
└── package.json          # Dependencies and scripts
```

## Testing in This Environment

Since this is a Linux environment, you can test the app using Expo's web mode:

1. Set up your environment variables in `.env`
2. Run `npm run web`
3. The app will open in your browser at `http://localhost:19006`

## Building for iOS

To build for iOS, you have two options:

### Option 1: EAS Build (Recommended - works on any platform)
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure the project
eas build:configure

# Build for iOS
eas build --platform ios
```

### Option 2: Local Build (requires macOS)
```bash
npm run ios
```

## Troubleshooting

### "Missing environment variables" error
- Make sure you've created a `.env` file with valid Supabase credentials
- Restart the development server after changing environment variables

### Icons not showing
- Make sure `react-native-svg` is installed
- Try clearing the cache: `expo start -c`

### Navigation errors
- Ensure all navigation dependencies are installed
- Check that screen names in navigation match the Stack.Screen components

## Next Steps

- Add offline support with local caching
- Implement pull-to-refresh functionality
- Add search and filter capabilities
- Implement image uploads for opportunities
- Add push notifications for opportunity updates
