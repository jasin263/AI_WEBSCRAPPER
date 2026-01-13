import React, { useRef, useEffect } from 'react';
import { Message as MessageType } from '../types';
import Message from './Message';
import ThinkingBubble from './ThinkingBubble';

interface ChatInterfaceProps {
    messages: MessageType[];
    isLoading: boolean;
}

export default function ChatInterface({ messages, isLoading }: ChatInterfaceProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    return (
        <div className="flex-1 overflow-y-auto px-4 py-6 w-full max-w-4xl mx-auto custom-scrollbar">
            {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-zinc-500 opacity-60">
                    <div className="mb-4 p-4 rounded-full bg-[var(--surface-hover)]">
                        <span className="text-4xl grayscale">🕷️</span>
                    </div>
                    <h3 className="text-xl font-heading font-medium mb-2 text-[var(--foreground)]">Web Scraper AI</h3>
                    <p className="text-sm max-w-sm text-center">Enter a URL below to extract content, summary, or specific data points.</p>
                </div>
            ) : (
                <>
                    {messages.map((msg) => (
                        <Message key={msg.id} message={msg} />
                    ))}
                    {isLoading && <ThinkingBubble />}
                </>
            )}
            <div ref={bottomRef} className="pt-4" />
        </div>
    );
}
