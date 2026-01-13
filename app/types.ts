export interface Message {
    id: string;
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: number;
}

export interface ScrapeRequest {
    url: string; // Legacy/Primary
    urls?: string[]; // Compare Mode
    prompt: string;
    apiKey: string;
    gameMode?: boolean; // Web RPG Mode
    timeTravel?: boolean; // Wayback Machine Mode
    timeTravelYear?: number; // Target Year
}

export interface ChatSession {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
}
