import React, { useState } from 'react';
import { MessageSquarePlus, PanelLeftOpen, History, Trash2, Download, FileJson, FileText, Hexagon } from 'lucide-react';
import { ChatSession } from '../types';
import { exportToJSON, exportToMarkdown } from '../utils/export';

interface SidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onNewChat: () => void;
    onSelectSession: (id: string) => void;
    onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export default function Sidebar({ sessions, currentSessionId, onNewChat, onSelectSession, onDeleteSession }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(true);

    const getCurrentSession = () => sessions.find(s => s.id === currentSessionId);

    const handleExportJSON = () => {
        const session = getCurrentSession();
        if (session) exportToJSON(session.messages, session.title);
    };

    const handleExportMD = () => {
        const session = getCurrentSession();
        if (session) exportToMarkdown(session.messages, session.title);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-4 left-4 z-50 p-2 text-zinc-400 hover:text-white transition-colors md:hidden"
            >
                <PanelLeftOpen />
            </button>

            <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[var(--sidebar)] border-r border-[var(--border)]
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:static'}
      `}>

                {/* Brand Header */}
                <div className="flex items-center gap-3 px-6 py-6">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <Hexagon className="text-white fill-white/20" size={18} strokeWidth={2.5} />
                    </div>
                    <span className="font-heading font-bold text-lg tracking-tight text-zinc-100">NexScraper AI</span>
                </div>

                {/* New Chat Button */}
                <div className="px-4 pb-4">
                    <button
                        onClick={onNewChat}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-[var(--surface-hover)] hover:bg-[#393b3d] text-[var(--foreground)] rounded-full transition-colors text-sm font-medium"
                    >
                        <MessageSquarePlus size={18} />
                        New Scrape
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 py-2">
                    <div className="px-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Recent</div>
                    <div className="space-y-1">
                        {sessions.length === 0 && (
                            <div className="px-4 py-3 text-sm text-zinc-500 italic">No recent history</div>
                        )}
                        {sessions.slice().reverse().map((session) => (
                            <div
                                key={session.id}
                                onClick={() => onSelectSession(session.id)}
                                className={`
                            group px-3 py-2 rounded-lg text-sm cursor-pointer truncate transition-colors flex items-center gap-2 justify-between
                            ${currentSessionId === session.id ? 'bg-[var(--surface-hover)] text-white' : 'text-zinc-400 hover:bg-[var(--surface-hover)] hover:text-zinc-200'}
                        `}
                            >
                                <div className="flex items-center gap-2 truncate">
                                    <History size={14} className="opacity-50 shrink-0" />
                                    <span className="truncate">{session.title}</span>
                                </div>

                                <button
                                    onClick={(e) => onDeleteSession(session.id, e)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-opacity"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Actions (Export) */}
                {currentSessionId && (
                    <div className="p-4 border-t border-[var(--border)]">
                        <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Export Chat</div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleExportJSON}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-xs font-medium text-zinc-300 transition-colors"
                                title="Export as JSON"
                            >
                                <FileJson size={14} />
                                JSON
                            </button>
                            <button
                                onClick={handleExportMD}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[var(--surface)] hover:bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg text-xs font-medium text-zinc-300 transition-colors"
                                title="Export as Markdown"
                            >
                                <FileText size={14} />
                                MD
                            </button>
                        </div>
                    </div>
                )}
            </aside>
        </>
    );
}
