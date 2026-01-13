import React, { useState, useEffect } from 'react';
import { Send, Link2, Sparkles, Mic, MicOff, Gamepad2, History } from 'lucide-react';
import { ScrapeRequest } from '../types';

interface ScraperInputProps {
    onScrape: (req: ScrapeRequest) => void;
    isLoading: boolean;
}

export default function ScraperInput({ onScrape, isLoading }: ScraperInputProps) {
    const [url, setUrl] = useState('');
    const [prompt, setPrompt] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [isGameMode, setIsGameMode] = useState(false);
    const [isTimeTravel, setIsTimeTravel] = useState(false);
    const [year, setYear] = useState(2015);
    const [recognition, setRecognition] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false;
                recognition.interimResults = false;
                recognition.lang = 'en-US';

                recognition.onstart = () => setIsListening(true);
                recognition.onend = () => setIsListening(false);
                recognition.onerror = (event: any) => {
                    console.error("Speech recognition error", event.error);
                    setIsListening(false);
                };
                recognition.onresult = (event: any) => {
                    const transcript = event.results[0][0].transcript;
                    setPrompt((prev) => prev ? `${prev} ${transcript}` : transcript);
                };

                setRecognition(recognition);
            }
        }
    }, []);

    const toggleListening = () => {
        if (!recognition) {
            alert("Speech recognition is not supported in this browser.");
            return;
        }
        if (isListening) {
            recognition.stop(); // Try stop first to get results
            // recognition.abort(); // Use abort if you want immediate stop without results
        } else {
            try {
                recognition.start();
            } catch (e) {
                console.error("Error starting recognition:", e);
                // If it claims it's already started, try stopping first or assume inconsistent state
                recognition.stop();
            }
        }
    };

    const toggleGameMode = () => {
        setIsGameMode(!isGameMode);
        if (!isGameMode) setIsTimeTravel(false);
    };

    const toggleTimeTravel = () => {
        setIsTimeTravel(!isTimeTravel);
        if (!isTimeTravel) setIsGameMode(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url && prompt) {
            // Check for multiple URLs
            const urls = url.split(/[,\s]+/).filter(u => u.length > 5);
            if (urls.length > 1) {
                onScrape({ url: urls[0], urls, prompt, apiKey: '', gameMode: isGameMode, timeTravel: isTimeTravel, timeTravelYear: isTimeTravel ? year : undefined });
            } else {
                onScrape({ url: urls[0], prompt, apiKey: '', gameMode: isGameMode, timeTravel: isTimeTravel, timeTravelYear: isTimeTravel ? year : undefined });
            }
        }
    };

    const getPlaceholder = () => {
        if (isGameMode) return "Enter the Realm URL to explore...";
        if (isTimeTravel) return "Paste URL to visit in 2020...";
        return "Paste website link (or multiple separated by space/comma)...";
    };

    const getPromptPlaceholder = () => {
        if (isGameMode) return "What is your quest, brave traveler?";
        if (isTimeTravel) return "What historical data do you seek?";
        return "What do you want to extract?";
    };

    const getTheme = () => {
        if (isGameMode) return 'bg-indigo-950/40 border-indigo-500/50 shadow-indigo-500/10 focus-within:ring-indigo-500';
        if (isTimeTravel) return 'bg-amber-950/40 border-amber-500/50 shadow-amber-500/10 focus-within:ring-amber-500';
        return 'bg-[var(--input-bg)] border-[var(--border)] focus-within:ring-[var(--primary)]';
    };

    return (
        <div className="w-full max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className={`relative rounded-[26px] p-4 shadow-xl border focus-within:ring-1 transition-all duration-500 ${getTheme()}`}>

                <div className="space-y-3">
                    {/* URL Input */}
                    <div className={`flex items-center gap-3 border-b pb-3 
                        ${isGameMode ? 'border-indigo-500/30' : isTimeTravel ? 'border-amber-500/30' : 'border-[var(--border)]'}`}>
                        <Link2 className={`
                            ${isGameMode ? 'text-indigo-400' : isTimeTravel ? 'text-amber-400' : 'text-zinc-400'} shrink-0`} size={20} />
                        <input
                            type="text"
                            required
                            placeholder={getPlaceholder()}
                            className="bg-transparent border-none outline-none w-full text-base text-zinc-200 placeholder:text-zinc-500 font-sans"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* Prompt Input */}
                    <div className="flex items-start gap-3">
                        <Sparkles className={`
                            ${isGameMode ? 'text-indigo-400' : isTimeTravel ? 'text-amber-400' : 'text-zinc-400'} shrink-0 mt-1`} size={20} />
                        <textarea
                            required
                            rows={1}
                            placeholder={getPromptPlaceholder()}
                            className="bg-transparent border-none outline-none w-full text-base text-zinc-200 placeholder:text-zinc-500 font-sans resize-none custom-scrollbar"
                            value={prompt}
                            onChange={(e) => {
                                setPrompt(e.target.value);
                                e.target.style.height = 'auto';
                                e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            style={{ maxHeight: '120px' }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit(e);
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex justify-between items-center mt-3 pt-2">
                    <div className="flex gap-2 text-xs text-zinc-500">
                        {(!isGameMode && !isTimeTravel) && (
                            <>
                                <span
                                    onClick={() => setPrompt("Summarize this page in 3 sentences.")}
                                    className="bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700 cursor-pointer transition-colors"
                                >
                                    Summarize
                                </span>
                                <span
                                    onClick={() => setPrompt("Extract all main headings and images.")}
                                    className="bg-zinc-800 px-2 py-1 rounded hover:bg-zinc-700 cursor-pointer transition-colors"
                                >
                                    Structure
                                </span>
                            </>
                        )}
                        {isGameMode && <span className="text-indigo-400 animate-pulse font-mono tracking-wider">RPG MODE ACTIVE</span>}
                        {isTimeTravel && <span className="text-amber-400 animate-pulse font-mono tracking-wider">TIME TRAVEL: {year}</span>}
                    </div>

                    <div className="flex items-center gap-3">
                        {isTimeTravel && (
                            <div className="flex items-center gap-1 bg-amber-950/50 border border-amber-500/30 rounded-lg px-2 py-1 animate-in fade-in slide-in-from-right-5">
                                <span className="text-amber-500 text-[10px] font-mono tracking-wider">YEAR</span>
                                <input
                                    type="number"
                                    min="1995"
                                    max={new Date().getFullYear()}
                                    value={year}
                                    onChange={(e) => setYear(parseInt(e.target.value))}
                                    className="bg-transparent border-none outline-none text-amber-500 w-12 text-sm font-bold text-center"
                                />
                            </div>
                        )}

                        {/* Time Travel Button */}
                        <button
                            type="button"
                            onClick={toggleTimeTravel}
                            className={`
                                w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                                ${isTimeTravel ? 'bg-amber-600/20 text-amber-400 -rotate-12 scale-110 shadow-lg shadow-amber-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                            `}
                            title="Time Travel Mode (2020 Snapshot)"
                        >
                            <History size={18} />
                        </button>

                        {/* Game Mode Button */}
                        <button
                            type="button"
                            onClick={toggleGameMode}
                            className={`
                                w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                                ${isGameMode ? 'bg-indigo-600/20 text-indigo-400 rotate-12 scale-110 shadow-lg shadow-indigo-500/30' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                            `}
                            title="Gamify Mode (RPG)"
                        >
                            <Gamepad2 size={18} />
                        </button>

                        {/* Voice Button */}
                        <div className="relative">
                            {isListening && (
                                <div className="absolute inset-0 bg-red-500/30 rounded-full animate-ripple z-0"></div>
                            )}
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`
                                    relative z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300
                                    ${isListening ? 'bg-red-500/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'}
                                `}
                                title="Voice Input"
                            >
                                {isListening ? (
                                    <div className="flex gap-[2px] items-center h-3">
                                        <div className="w-[2px] bg-red-500 rounded-full animate-soundwave" style={{ animationDelay: '0s' }}></div>
                                        <div className="w-[2px] bg-red-500 rounded-full animate-soundwave" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-[2px] bg-red-500 rounded-full animate-soundwave" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                ) : (
                                    <Mic size={18} />
                                )}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !url || !prompt}
                            className={`
                            w-8 h-8 flex items-center justify-center rounded-lg transition-all
                            ${isLoading || !url || !prompt
                                    ? 'bg-zinc-800 text-zinc-600'
                                    : isGameMode ? 'bg-indigo-600 text-white hover:bg-indigo-500' : 'bg-white text-black hover:bg-zinc-200'}
                        `}
                        >
                            {isLoading ? (
                                <div className="w-4 h-4 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </div>
                </div>
            </form>
            <div className="text-center mt-2 text-xs text-zinc-500">
                {isGameMode ? "Embark on an epic quest through the data realms." : "AI can make mistakes. Verify extracted data."}
            </div>
        </div>
    );
}
