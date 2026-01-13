import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';
// import { GoogleGenerativeAI } from '@google/generative-ai'; // Removed to use raw fetch

export async function POST(req: NextRequest) {
    try {
        const { url, urls, prompt, apiKey, gameMode, timeTravel, timeTravelYear } = await req.json();

        // Validate URLs
        const targetUrls = (urls && urls.length > 0) ? urls : [url];
        if (targetUrls.length === 0 || !prompt) {
            return NextResponse.json({ error: 'Missing URL or prompt' }, { status: 400 });
        }

        // Use provided key or server-side environment key
        const finalApiKey = apiKey || process.env.GEMINI_API_KEY;
        if (!finalApiKey) return NextResponse.json({ error: 'API Key is required' }, { status: 400 });

        const isGemini = finalApiKey.startsWith('AIza');

        // Helper: Fetch and Parse Single URL
        const fetchAndParse = async (originalUrl: string, index: number) => {
            let targetUrl = originalUrl;
            let isArchived = false;

            if (timeTravel) {
                try {
                    const targetYear = timeTravelYear || 2020;
                    console.log(`Checking Wayback Machine for ${originalUrl} in ${targetYear}...`);
                    const waybackRes = await fetch(`https://archive.org/wayback/available?url=${originalUrl}&timestamp=${targetYear}0101`);
                    const waybackData = await waybackRes.json();
                    const snapshot = waybackData.archived_snapshots.closest;
                    if (snapshot && snapshot.url) {
                        targetUrl = snapshot.url;
                        isArchived = true;
                        console.log(`Found snapshot: ${targetUrl}`);
                    } else {
                        return { error: `No ${targetYear} snapshot found for ${originalUrl}` };
                    }
                } catch (e) {
                    console.error("Wayback API Error:", e);
                    // Fallback to live or error? unique feature implies strictness.
                    return { error: `Wayback Machine Error for ${originalUrl}` };
                }
            }

            console.log(`Fetching ${targetUrl}...`);
            try {
                const response = await fetch(targetUrl, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
                    next: { revalidate: 0 }
                });
                if (!response.ok) return { error: `Failed to fetch ${targetUrl}` };

                const html = await response.text();
                const $ = cheerio.load(html);

                // Extract Metadata
                const title = $('title').text() || '';

                // Extract Body
                $('script, style, noscript, iframe, svg, form, footer, nav').remove();
                let content = $('body').text().replace(/\s+/g, ' ').trim();
                const maxLen = 10000;
                if (content.length > maxLen) content = content.substring(0, maxLen) + '...';

                // Extract Images (Limited)
                const images: any[] = [];
                $('img').each((_, el) => {
                    const src = $(el).attr('src');
                    if (src && !src.startsWith('data:')) images.push({ src, alt: $(el).attr('alt') || '' });
                });

                return {
                    source_id: index + 1,
                    url: originalUrl, // Keep original for reference
                    archived_url: isArchived ? targetUrl : undefined,
                    title: isArchived ? `[ARCHIVED 2020] ${title}` : title,
                    content,
                    images: images.slice(0, 10)
                };
            } catch (e: any) {
                return { error: `Error fetching ${targetUrl}: ${e.message}` };
            }
        };

        // Fetch All URLs in Parallel
        const scrapedData = await Promise.all(targetUrls.map((u: string, i: number) => fetchAndParse(u, i)));

        // Prepare Context
        const validData = scrapedData.filter(d => !d.error);
        if (validData.length === 0) {
            throw new Error("Failed to fetch any of the provided URLs.");
        }

        let result = '';

        if (isGemini) {
            const models = ['gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-2.0-flash-exp'];
            // Construct Comparison Prompt
            const fullPrompt = `
                System: ${gameMode ?
                    `You are the "Dungeon Master" of this website. 🏰
                     Your goal is to gamify the browsing experience. Transform the provided website content into a text adventure setting.
                     - The <header> is the Sky Castle or Entrance.
                     - The 'Pricing' section is the Merchant's Guild.
                     - The 'About/Team' section is the Hall of Heroes.
                     - Describe the scene vividly using RPG tropes (loot, quests, enemies).
                     - END with 3 distinct choices (A, B, C) for what the player can do next based on the links/content.
                     - Be immersive, fun, and dramatic.`
                    : 'You are an expert data analyst.'}
                
                ${timeTravel ? `TIME TRAVEL MODE ACTIVE: You are analyzing a historical snapshot from around ${timeTravelYear || 2020}. Treat this as historical data from that year.` : ''}
                ${validData.length > 1 ? 'Comparison Mode Active.' : 'Single Source Mode.'}
                
                User Request: ${prompt}

                STRICT OUTPUT RULES (Ignored in RPG Mode):
                - If User asks for "Images Only": Return ONLY an image gallery using Markdown: ![Alt](Src). No other text.
                - If User asks for "Links Only": Return ONLY a bulleted list of links.
                - If User asks for "Text Only": Return ONLY the cleaned body text. Do not show images/charts.
                - If User asks for "Structure/Headings Only": Return ONLY the heading hierarchy.
                - Otherwise, answer naturally using all available data, displaying images where relevant. 

                FORMATTING STANDARDS (Apply to ALL responses):
                - Use **Bold** for key terms and insights.
                - Use "### Headings" to organize sections clearly.
                - Use Bullet points for lists (never long blocks of text).
                - Keep paragraphs short (maximum 3-4 lines).
                - Use "---" (Horizontal Rules) to separate major sections.
                - Make it visually pleasing and easy to scan. 
                GENERATE a JSON object in this format wrapped in '!!!CHART_START!!!' and '!!!CHART_END!!!':
                !!!CHART_START!!!
                {
                    "type": "bar", // or "pie"
                    "title": "Chart Title",
                    "data": [
                        { "name": "Label 1", "value": 10 },
                        { "name": "Label 2", "value": 20 }
                    ]
                }
                !!!CHART_END!!!

                --- DATA SOURCES ---
                ${JSON.stringify(validData, null, 2)}
             `;

            let contentGenerated = false;
            let lastError = '';

            for (const model of models) {
                try {
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${finalApiKey}`;
                    const geminiResponse = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ contents: [{ parts: [{ text: fullPrompt }] }] })
                    });

                    if (!geminiResponse.ok) throw new Error(await geminiResponse.text());

                    const geminiData = await geminiResponse.json();
                    if (geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
                        result = geminiData.candidates[0].content.parts[0].text;
                        contentGenerated = true;
                        break;
                    }
                } catch (e: any) {
                    lastError = e.message;
                }
            }
            if (!contentGenerated) throw new Error(`Gemini Error: ${lastError}`);

        } else {
            // OpenAI Fallback (Simplified)
            const openai = new OpenAI({ apiKey: finalApiKey });
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: 'system', content: 'You are a web scraper. Analyze the provided JSON data sources.' },
                    { role: 'user', content: `Request: ${prompt}\n\nData: ${JSON.stringify(validData)}` }
                ],
                model: 'gpt-4o-mini',
            });
            result = completion.choices[0].message.content || 'Error';
        }

        return NextResponse.json({ result });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
