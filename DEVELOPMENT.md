# 🍽️ NutriPlan AI - Smart Meal Planning

A beautiful AI-powered meal planning application built with React, TypeScript, and Google Gemini AI.

## 🚀 Quick Start

1. **Get your API key**: Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. **Set up environment**: Add your API key to `.env`
3. **Start the app**: `npm run dev`

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Edit .env and add your API key
# VITE_GEMINI_API_KEY=your_actual_api_key_here

# 3. Start development server
npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:8080 (or next available port)

## 🎨 Features

- 🎨 Dark theme with colorful accents
- 🤖 AI-powered meal planning
- 💰 Budget-conscious suggestions
- 🥗 Dietary restriction support
- 📱 Responsive design
- 🔄 Real-time generation

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **AI**: Google Gemini 1.5 Flash
- **Deployment**: Vercel

## 📝 Environment Setup

**Required Environment Variables (.env):**
```env
VITE_GEMINI_API_KEY=your_api_key_here
```

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## 🔒 Security Notes

- API key is required for AI functionality
- Key is only used in browser during development
- For production deployment, consider implementing a backend proxy
- Never commit your `.env` file to version control

---

**Happy meal planning! 🍽️✨**
