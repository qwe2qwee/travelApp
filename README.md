# Travel App

A modern, full-featured mobile application for travel enthusiasts, built with **React Native**, **Expo**, and **Supabase**. This app allows users to discover popular travel destinations, share their experiences through posts, explore locations on an interactive map, plan itineraries, and chat with other travelers.

## 🚀 Features

- **🏠 Home Feed**: Discover popular posts, recommended places, and verified travel spots.
- **🗺️ Interactive Map**: Explore destinations and view user posts on a dynamic map.
- **📝 Create Posts**: Share your travel stories with photos, videos, and location tags.
- **📅 Itinerary Planner**: Organize your trips and manage your travel schedule.
- **💬 Real-time Chat**: Connect and message with other travelers.
- **🔐 Authentication**: Secure user sign-up and login powered by Supabase Auth.
- **🎨 Modern UI/UX**: A clean, responsive design using custom headers, tab navigation, and smooth animations.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router v6
- **Styling**: StyleSheet, Lucide React Native Icons
- **Maps**: react-native-maps, Leaflet
- **Media**: Expo Image, Expo Video, Expo Image Picker

### Backend

- **BaaS (Backend-as-a-Service)**: Supabase
- **Database**: PostgreSQL
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: (LTS version recommended)
- **npm** or **yarn**: Package manager
- **Expo Go**: Installed on your physical Android/iOS device (for testing)
- **Git**: Version control

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel
   ```

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
