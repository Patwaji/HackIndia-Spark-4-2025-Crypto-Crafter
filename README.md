# 🍽️ NutriPlan AI - AI-Powered Meal Planning Platform

<div align="center">

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-10.14.1-orange?logo=firebase)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

*An intelligent meal planning platform that creates personalized nutrition plans using advanced AI*

[Live Demo](https://nutriplan-ai.vercel.app/) • [Features](#features) • [Getting Started](#getting-started) • [API Documentation](#api-reference)

</div>

## 🌟 Overview

NutriPlan AI revolutionizes meal planning by combining the power of Google's Gemini AI with modern web technologies. Our platform creates personalized meal plans that consider your dietary preferences, budget constraints, health goals, and nutritional requirements - all while ensuring accurate calorie compliance and authentic Indian cuisine experiences.

### 🎯 Built for HackIndia Spark 4 2025

This project represents the future of AI-powered nutrition planning, showcasing how machine learning can make healthy eating accessible, affordable, and enjoyable for everyone.

## ✨ Features

### 🤖 **AI-Powered Intelligence**
- **Gemini AI Integration**: Advanced meal planning using Google's latest language model
- **Smart Calorie Compliance**: Precise calorie calculations with ±50 calorie accuracy
- **Dietary Intelligence**: Automatic ingredient substitutions for dietary restrictions
- **Cost Optimization**: Budget-aware meal suggestions with Indian market pricing

### 🍳 **Comprehensive Meal Management**
- **Personalized Plans**: Custom meal plans based on health goals and preferences
- **Recipe Generation**: Detailed cooking instructions with authentic Indian techniques
- **Nutrition Analytics**: Complete macronutrient breakdown with visual progress tracking
- **Shopping Lists**: Auto-generated grocery lists with cost estimates

### 🔐 **User Experience**
- **Firebase Authentication**: Secure user accounts with Google/Email login
- **Plan Persistence**: Save and manage multiple meal plans
- **Responsive Design**: Beautiful UI that works on all devices
- **Real-time Sync**: Cloud-based storage for seamless access across devices

### 🎥 **Advanced Features** (Coming Soon)
- **AI Video Generation**: Step-by-step cooking videos using AI
- **Food Photo Analysis**: Smart ingredient recognition via Google Vision API
- **Social Features**: Share plans and get community feedback

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for beautiful, accessible components

### **Backend & Services**
- **Firebase** (Authentication, Firestore, Hosting)
- **Google Gemini AI** for intelligent meal planning
- **Google Vision API** for food photo analysis
- **Free AI Video APIs** (Runway ML, ElevenLabs, Pika Labs)

### **Development Tools**
- **ESLint** for code quality
- **PostCSS** for CSS processing
- **React Hook Form** for form management
- **Lucide Icons** for consistent iconography

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with enabled services
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Patwaji/HackIndia-Spark-4-2025-Crypto-Crafter.git
   cd HackIndia-Spark-4-2025-Crypto-Crafter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Google Vision API (for food photo analysis)
   VITE_GOOGLE_VISION_API_KEY=your_vision_api_key
   
   # App Configuration
   VITE_APP_NAME=NutriPlan AI
   VITE_APP_VERSION=1.0.0
   VITE_APP_ENV=development
   
   # Feature Flags
   VITE_ENABLE_VIDEO_GENERATION=true
   VITE_ENABLE_FOOD_PHOTO_ANALYSIS=true
   VITE_ENABLE_AI_CHAT=true
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080`

### 🔑 API Keys Setup

#### Google Gemini AI
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Add to your `.env` as `VITE_GEMINI_API_KEY`

#### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication, Firestore, and Hosting
3. Copy your config to `.env` file

#### Google Vision API (Optional)
1. Enable Vision API in Google Cloud Console
2. Create API key and add as `VITE_GOOGLE_VISION_API_KEY`

## 📱 Usage

### Creating Your First Meal Plan

1. **Profile Setup**: Enter your dietary preferences, health goals, and budget
2. **Generate Plan**: Let AI create a personalized meal plan
3. **Customize**: Review and adjust meals to your liking
4. **Cook & Track**: Follow recipes and track your nutrition progress

### Key Features Walkthrough

- **🎯 Goal Setting**: Choose from weight loss, muscle gain, or maintenance
- **🥗 Dietary Preferences**: Support for vegetarian, vegan, keto, and more
- **💰 Budget Planning**: Set daily/weekly budget constraints
- **📊 Nutrition Tracking**: Visual macronutrient breakdown
- **🛒 Smart Shopping**: Auto-generated grocery lists with Indian market prices

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── MealPlanWizard/ # Main meal planning interface
│   ├── MealPlanDisplay/# Meal plan visualization
│   └── VideoGenerator/ # AI video generation (coming soon)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
│   ├── gemini.ts      # AI service integration
│   ├── firebase.ts    # Firebase configuration
│   └── utils.ts       # Helper functions
├── pages/              # Page components
└── assets/             # Static assets
```

## 🔧 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🚀 Deployment

### Firebase Hosting (Recommended)

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Alternative Deployment Options
- **Vercel**: Connect your GitHub repo for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket

## 📊 Performance & Analytics

- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Efficient code splitting and tree shaking
- **SEO Ready**: Meta tags and structured data
- **PWA Support**: Installable web app experience

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 🙏 Acknowledgments

- **Google Gemini AI** for powerful language processing
- **Firebase** for reliable backend infrastructure
- **shadcn/ui** for beautiful component library
- **Tailwind CSS** for flexible styling system
- **HackIndia Spark 4 2025** for the opportunity to innovate

---

<div align="center">

**Made with ❤️ for HackIndia Spark 4 2025**

[⬆ Back to Top](#-nutriplan-ai---ai-powered-meal-planning-platform)

</div>
