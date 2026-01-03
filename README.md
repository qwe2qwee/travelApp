# 🌍 Travel App

A modern, full-featured mobile application for travel enthusiasts, built with **React Native**, **Expo**, and **Supabase**. This app allows users to discover popular travel destinations, share their travel experiences through posts with photos/videos, explore locations on an interactive map, plan itineraries, and connect with other travelers in real-time.

**Demo App**: Available on iOS and Android via Expo Go

---

## 🎯 Features

### 🏠 Home Feed

- Discover popular posts from other travelers
- View recommended destinations and verified travel spots
- Like and save your favorite posts
- Real-time feed updates

### 🗺️ Interactive Map

- Explore destinations and user posts on a dynamic Google Map
- Filter posts by category (Food, Nature, Culture, Nightlife, Shopping, Transport)
- View post details by tapping map markers
- Get real-time directions using Google Maps integration
- Cluster markers for better performance with many locations

### 📝 Create Posts

- Share your travel stories with photos or videos
- Add location tags automatically or manually
- Categorize posts (Food, Nature, Culture, etc.)
- Add titles, captions, and descriptions
- Upload media directly to secure cloud storage

### 📅 Itinerary Planner

- Plan and organize your trips
- Manage your travel schedule
- Create personalized travel itineraries
- Calculate trip duration and details

### 💬 Real-time Chat

- Connect and message with other travelers
- Real-time message updates using Supabase Realtime
- User presence indicators
- Chat history

### 🔐 Authentication

- Secure user registration and login
- Email verification
- Password reset functionality
- Session management with Supabase Auth

### 🎨 Modern UI/UX

- Clean and intuitive design
- Responsive layout for all screen sizes
- Smooth animations and transitions
- Dark/Light mode support
- Custom tab navigation

### 🤖 AI-Powered Features

- **Saudi Arabia Travel Chat**: AI travel assistant for Saudi Arabia recommendations

  - Powered by Groq AI (fast & free)
  - Real-time travel recommendations
  - Multi-language support
  - Personalized responses

- **Intelligent Itinerary Generator**: Auto-generate trip itineraries
  - Custom day-by-day plans
  - Interest-based recommendations
  - Optimal route planning
  - Time-based activities

---

## 🛠️ Tech Stack

### Frontend

- **Framework**: React Native with Expo 54
- **Language**: TypeScript 5.x
- **Navigation**: Expo Router v6 (File-based routing)
- **Styling**: React Native StyleSheet
- **Icons**: Lucide React Native
- **Maps**: react-native-maps with Google Maps SDK
- **Media Handling**:
  - Expo Image (modern image loading)
  - Expo Video (video playback)
  - Expo Image Picker (media selection)
  - Expo Image Manipulator (image processing)
- **Storage**: Expo File System
- **Location**: Expo Location API
- **Haptics**: Expo Haptics for user feedback

### Backend & Services

- **BaaS**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (for media files)
- **Real-time**: Supabase Realtime subscriptions
- **Edge Functions**: Supabase Edge Functions (TypeScript/Deno)
  - Runtime: Deno (V8 JavaScript Engine)
  - AI Integration: Groq API (fast LLM inference)
  - Language: TypeScript
  - Functions:
    - `saudi-chat`: Travel assistant chatbot
    - `generate-itinerary`: AI-powered trip planning

### Development Tools

- **Package Manager**: npm / yarn
- **Linting**: ESLint
- **Version Control**: Git
- **Build Tool**: Expo CLI

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v16 or higher (LTS version recommended)

  - Download from [nodejs.org](https://nodejs.org)
  - Verify: `node --version && npm --version`

- **npm or yarn**: Package manager

  - npm comes with Node.js
  - Or install yarn: `npm install -g yarn`

- **Expo Go App**:

  - Available on [App Store](https://apps.apple.com/app/expo-go/id982107779) (iOS)
  - Available on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android)

- **Git**: Version control

  - Download from [git-scm.com](https://git-scm.com)

- **Text Editor or IDE**:

  - VS Code (recommended)
  - Android Studio / Xcode (optional, for native debugging)

- **Supabase Account**:

  - Create account at [supabase.com](https://supabase.com)
  - Create a new project
  - Note your Project URL and API Key

- **Groq API Key** (for AI features):

  - Create account at [console.groq.com](https://console.groq.com)
  - Get your free API key (no credit card required)
  - Used for travel chat and itinerary generation

- **Supabase CLI** (for Edge Functions):
  ```bash
  npm install -g supabase
  ```

---

## 🤖 Edge Functions Overview

This app uses **Supabase Edge Functions** (serverless functions running on Deno) to power AI features:

### Available Edge Functions

#### 1️⃣ **saudi-chat** - Travel Assistant Chatbot

A conversational AI assistant specialized in Saudi Arabia travel recommendations.

**Features:**

- Real-time travel advice and recommendations
- Itinerary help and transportation info
- Food recommendations (including Halal options)
- Cultural insights and tips
- Sightseeing suggestions
- Powered by Groq's fast LLM API

**Tech:**

- Runtime: Deno (TypeScript)
- AI Model: Groq API (ultra-fast inference)
- CORS enabled for frontend integration
- Streaming responses

#### 2️⃣ **generate-itinerary** - Smart Itinerary Generator

AI-powered tool to automatically generate day-by-day trip itineraries.

**Features:**

- Custom itinerary generation based on trip length
- Interest-based activity suggestions
- Optimal activity sequencing
- Time management
- Location-aware recommendations
- JSON response for easy parsing

**Tech:**

- Runtime: Deno (TypeScript)
- AI Model: Groq API
- Retry logic for reliability
- JSON parsing and validation
- Error handling and fallbacks

### How Edge Functions Work

```
Mobile App
    ↓
Supabase Client
    ↓
Edge Function (Deno Runtime)
    ↓
Groq AI API
    ↓
Response → Mobile App
```

- Functions run on Supabase's global edge network
- Deno runtime provides TypeScript support
- Automatic CORS handling
- Real-time response streaming
- Serverless (no server management needed)

---

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/travel-app.git
cd travel
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Supabase

#### Create `.env.local` file in the root directory:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### Get these values from Supabase:

1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy your Project URL and Anon Key
4. Paste them into `.env.local`

### 4. Set Up Supabase Database

Run these SQL queries in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT CHECK (media_type IN ('photo', 'video')),
  title TEXT,
  caption TEXT,
  category TEXT,
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  spot_name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create messages table for chat
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create itineraries table
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. Set Up Storage Buckets

In Supabase Dashboard:

1. Go to "Storage" → "Buckets"
2. Create a new bucket named `posts` (Public)
3. Create a new bucket named `avatars` (Public)

### 6. Configure Google Maps (Optional but Recommended)

For better map functionality:

1. Get a Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com)
2. Update `app.json` with your API key:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-maps",
        {
          "googleMapsApiKey": "YOUR_GOOGLE_MAPS_API_KEY"
        }
      ]
    ]
  }
}
```

### 7. Deploy Supabase Edge Functions

The app uses AI-powered Edge Functions for intelligent features:

#### a) Saudi Arabia Travel Chat Assistant

Provides intelligent travel recommendations using Groq AI API.

**Setup:**

1. Get your Groq API Key from [console.groq.com](https://console.groq.com)
2. Deploy the function:

```bash
supabase functions deploy saudi-chat --project-id your_project_id
```

3. Set environment variables in Supabase Dashboard:
   - Go to "Project Settings" → "Edge Functions"
   - Add secret: `GROQ_API_KEY=your_groq_api_key`

**Usage in app:**

```typescript
const response = await supabase.functions.invoke('saudi-chat', {
  body: { messages: [...] }
});
```

#### b) Generate Itinerary

AI-powered itinerary generation for trips to Saudi Arabia.

**Setup:**

1. Deploy the function:

```bash
supabase functions deploy generate-itinerary --project-id your_project_id
```

2. Set environment variable:
   - Add secret: `GROQ_API_KEY=your_groq_api_key`

**Usage in app:**

```typescript
const itinerary = await supabase.functions.invoke("generate-itinerary", {
  body: {
    days: 7,
    interests: ["culture", "food", "nature"],
  },
});
```

#### Deploy All Functions at Once:

```bash
supabase functions deploy
```

---

## 🚀 Running the App

### Start the Development Server

```bash
npm start
# or
yarn start
```

This will start the Expo development server and display a QR code in your terminal.

### Run on Android

```bash
npm run android
# or
expo start --android
```

### Run on iOS

```bash
npm run ios
# or
expo start --ios
```

### Run on Web

```bash
npm run web
# or
expo start --web
```

### Using Expo Go App

1. Start the development server: `npm start`
2. Open Expo Go app on your phone
3. Scan the QR code displayed in your terminal
4. The app will load on your device

---

## 📂 Project Structure

```
travel/
├── app/                          # Main app routes (Expo Router)
│   ├── _layout.tsx              # Root layout
│   ├── (auth)/                  # Authentication routes
│   │   └── auth.tsx             # Login/Signup screen
│   ├── (tabs)/                  # Main tab navigation
│   │   ├── _layout.tsx          # Tab layout
│   │   ├── index.tsx            # Home feed
│   │   ├── map.tsx              # Map screen
│   │   ├── create.tsx           # Create post
│   │   ├── itinerary.tsx        # Itinerary planner
│   │   └── chat.tsx             # Chat screen
│   ├── post/
│   │   └── [id].tsx             # Post detail screen
│   └── place/
│       └── [id].tsx             # Place detail screen
│
├── components/                   # Reusable components
│   ├── ChatInput.tsx
│   ├── ChatMessage.tsx
│   ├── ItineraryDisplay.tsx
│   ├── LoadingMessages.tsx
│   ├── PopularDestinations.tsx
│   ├── TripForm.tsx
│   ├── Home/                    # Home screen components
│   ├── map/                     # Map related components
│   ├── Post/                    # Post related components
│   └── ui/                      # UI components
│
├── hooks/                        # Custom React hooks
│   ├── useChat.ts               # Chat logic
│   ├── useGeolocation.ts        # Location tracking
│   ├── usePlaces.ts             # Places data
│   ├── usePosts.ts              # Posts data + real-time sync
│   └── use-color-scheme.ts      # Theme management
│
├── contexts/                     # React Context for state
│   └── AuthContext.tsx          # Authentication state
│
├── integrations/                 # External service integrations
│   └── supabase/
│       ├── client.ts            # Supabase client config
│       └── types.ts             # TypeScript types
│
├── constants/                    # App constants
│   └── theme.ts                 # Theme colors and styles
│
├── assets/                       # Static assets
│   └── images/                  # App images and icons
│
└── scripts/                      # Utility scripts
    ├── inspect-ui.js
    └── reset-project.js
```

---

## 🔑 Key Features Explained

### Real-time Synchronization

- **Posts**: New posts appear instantly on the map and feed using Supabase Realtime subscriptions
- **Chat**: Messages update in real-time without manual refresh
- **Deletions**: Deleted posts disappear instantly from all screens

### Location Services

- **Auto-tagging**: Automatically captures user location when creating posts
- **Reverse Geocoding**: Converts coordinates to location names
- **Map Clustering**: Groups nearby posts for better performance

### Media Handling

- **Upload**: Images and videos are uploaded to Supabase Storage
- **Processing**: Images are optimized before upload
- **Playback**: Videos play directly from cloud storage

### User Authentication

- **Sign Up**: Create account with email and password
- **Sign In**: Secure login with session management
- **Password Reset**: Forgot password functionality
- **Profile Management**: Update display name and avatar

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User can register and log in
- [ ] User can create a post with photo/video
- [ ] Post appears on map immediately
- [ ] Post appears in home feed
- [ ] User can delete their own posts
- [ ] Deleted posts disappear from all screens
- [ ] User can view other users' posts
- [ ] Chat messages send and receive in real-time
- [ ] Itinerary planning works correctly
- [ ] Map shows correct locations

### Debug Mode

Enable debug logs:

```typescript
// In app.json or during development
console.log(); // Logs appear in Metro bundler terminal
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@supabase/supabase-js'"

- **Solution**: Run `npm install`

**Issue**: "Supabase connection failed"

- **Solution**: Check your `.env.local` file has correct URL and API key

**Issue**: "Map is not showing"

- **Solution**: Enable location permissions in app settings
- Verify Google Maps API key is configured

**Issue**: "Camera or Gallery not opening"

- **Solution**: Check app permissions in device settings

**Issue**: "Media upload fails"

- **Solution**: Check Supabase Storage bucket permissions are set to public

---

## 📱 Supported Platforms

- ✅ iOS 12+
- ✅ Android 8+
- ✅ Web (experimental)

---

## 🔐 Security Considerations

1. **Environment Variables**: Keep `.env.local` out of version control
2. **API Keys**: Use Supabase Anon Key (not Service Key) in frontend
3. **Row Level Security**: Enable RLS on Supabase tables
4. **Storage Permissions**: Set appropriate bucket policies
5. **Authentication**: Always validate user sessions

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Ameer**

- GitHub: [your-github-profile]
- Email: [your-email]

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, email [your-email] or open an issue on GitHub.

---

## 🚀 Future Enhancements

- [ ] Social features (follow, like, comments)
- [ ] Advanced search and filters
- [ ] Offline mode
- [ ] Push notifications
- [ ] Travel recommendations AI
- [ ] Budget tracking for trips
- [ ] Multi-language support
- [ ] Dark mode refinements

---

**Last Updated**: December 31, 2025

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   You need to configure your Supabase credentials. Create a `.env` file in the root directory or ensure your build environment has the following variables:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   > **Note**: These keys are required for the app to connect to the backend services.

## 📱 Running the App

To start the development server:

```bash
npx expo start
```

This will launch the Expo development server. You can then:

- Scan the QR code with **Expo Go** on your Android/iOS device.
- Press `w` to run in the web browser.
- Press `a` for Android Emulator (requires Android Studio).
- Press `i` for iOS Simulator (requires Xcode on macOS).

## 📂 Project Structure

```
travel/
├── app/                  # Application source code (Expo Router)
│   ├── (auth)/           # Authentication screens (Login/Signup)
│   ├── (tabs)/           # Main tab navigation (Home, Map, Create, Chat, Itinerary)
│   ├── post/             # Post details screens
│   └── place/            # Place details screens
├── components/           # Reusable UI components
├── constants/            # Theme colors and app constants
├── contexts/             # React Contexts (e.g., AuthContext)
├── hooks/                # Custom React hooks
├── integrations/         # Third-party services (Supabase client)
├── assets/               # Static assets (images, fonts)
└── scripts/              # Helper scripts
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📄 License

This project is open-source and available under the MIT License.
