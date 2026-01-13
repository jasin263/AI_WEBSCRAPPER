import React from 'react';
import { Bot } from 'lucide-react';

export default function ThinkingBubble() {
    return (
        <div className="flex w-full mb-6 justify-start animate-pulse">
            <div className="flex max-w-[85%] md:max-w-[75%] gap-4 flex-row">

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-[var(--surface-hover)] text-[var(--primary)] border border-[var(--border)]">
                    <Bot size={20} />
                </div>

                {/* Bubble */}
                <div className="p-4 rounded-2xl rounded-tl-sm bg-[var(--surface)] border border-[var(--border)] flex items-center gap-1">
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
}
