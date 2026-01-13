# NexScraper AI 🕸️✨

**NexScraper AI** is a next-generation web scraping and analysis tool powered by **Google Gemini**. It goes beyond simple HTML extraction by transforming raw web data into structured insights, interactive visualizations, and even playable RPG text adventures.

![NexScraper AI](https://via.placeholder.com/1200x600?text=NexScraper+AI+Dashboard)

## 🚀 Key Features

### 🧠 AI-Powered Analysis
- **Smart Extraction**: Ask questions like "Find the CEO's email" or "Summarize the pricing model" in plain English.
- **Strict Mode**: Request specific formats like `JSON`, `Markdown`, or `Tables` and get clean, structured output.

### ⚔️ Compare Mode
- **Multi-URL Analysis**: Paste multiple URLs (comma-separated) to compare competitors side-by-side.
- **UseCase**: "Compare the pricing of spotify.com vs applemusic.com".

### ⏳ Time Travel Mode (Wayback Machine)
- **Historical Scraping**: Travel back in time to scrape a website as it appeared in the past.
- **Custom Years**: Select any year (e.g., 2015, 2020) to retrieve historical snapshots via the Archive.org API.

### 🎮 Gamify Mode (Web RPG)
- **Dungeon Master Persona**: Transforms boring corporate websites into epic fantasy RPG settings.
- **Interactive**: The "About Us" page becomes a "Hall of Heroes", and pricing plans become "Merchant Wares".

### 📊 Auto-Visualization
- **Dynamic Charts**: Automatically detects tabular data in the AI's response and renders beautiful **Bar Charts** and **Pie Charts**.

### 🎤 Voice Control
- **Speech-to-Text**: Use the microphone to dictate your scraping prompts and URLs.
- **Fluid Animation**: Features a responsive soundwave visualization.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom Keyframe Animations
- **AI Model**: Google Gemini Pro (via custom REST API integration)
- **Scraping**: [Cheerio](https://cheerio.js.org/) for high-speed HTML parsing
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## 📦 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/nexscraper-ai.git
cd nexscraper-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
Create a `.env.local` file in the root directory and add your Google Gemini API key:
```env
GEMINI_API_KEY=AIzaSy...YourKeyHere
```
*Tip: Get a free key from [Google AI Studio](https://makersuite.google.com/).*

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🌍 Deployment

The easiest way to deploy is using **Vercel**:

1.  Push your code to GitHub.
2.  Import the project into Vercel.
3.  Add the `GEMINI_API_KEY` in the Vercel Project Settings > Environment Variables.
4.  Deploy!

*Note: The Free Hobby Plan on Vercel has a 10-second timeout for serverless functions. For heavy scraping tasks, consider upgrading to Pro or self-hosting.*

---

## 🔮 Future Roadmap
- [ ] **API Generator**: Turn any website into a public JSON API endpoint.
- [ ] **Lead Magnet**: Bulk extraction of emails from LinkedIn/Social lists.
- [ ] **Competitor Watchdog**: Automated cron jobs to monitor price changes.

---


