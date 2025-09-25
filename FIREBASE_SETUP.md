# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "meal-planner-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## 2. Enable Authentication

1. In your Firebase project console, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable the following providers:
   - **Email/Password**: Click on it and toggle "Enable"
   - **Google**: Click on it, toggle "Enable", and add your project's domain to authorized domains

## 3. Set up Firestore Database

1. In your Firebase project console, go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## 4. Get Firebase Configuration

1. In your Firebase project console, click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "Meal Planner Web")
6. Click "Register app"
7. Copy the configuration object

## 5. Update Environment Variables

Replace the placeholder values in your `.env` file with your actual Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Example:
```env
VITE_FIREBASE_API_KEY=AIzaSyDJbBeEuwjGhMU2ssjCh00_3QO97X-6pWM
VITE_FIREBASE_AUTH_DOMAIN=meal-planner-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=meal-planner-12345
VITE_FIREBASE_STORAGE_BUCKET=meal-planner-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456789
```

## 6. Configure Authorized Domains (for deployment)

1. In Firebase Console, go to Authentication > Settings > Authorized domains
2. Add your deployment domain (e.g., `your-app.vercel.app`)

## 7. Test the Application

1. Restart your development server: `npm run dev`
2. Open the application in your browser
3. Test the authentication features:
   - Sign up with email/password
   - Sign in with Google
   - Create and save a meal plan
   - Export shopping list and calendar

## Troubleshooting

- **"Firebase app not initialized"**: Make sure all environment variables are set correctly
- **Authentication errors**: Check that Email/Password and Google sign-in are enabled in Firebase Console
- **Database permission errors**: Ensure Firestore is set up with proper security rules
- **Domain not authorized**: Add your domain to Firebase Auth authorized domains

## Security Rules for Production

When deploying to production, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Meal plans are private to the user
    match /mealPlans/{planId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```
