"use client";

import { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import ScraperInput from './components/ScraperInput';
import Sidebar from './components/Sidebar';
import { Message, ScrapeRequest, ChatSession } from './types';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize or Load Sessions
  useEffect(() => {
    const storedSessions = localStorage.getItem('scraper_sessions');
    if (storedSessions) {
      const parsed = JSON.parse(storedSessions);
      setSessions(parsed);
      if (parsed.length > 0) {
        setCurrentSessionId(parsed[0].id);
      } else {
        createNewSession();
      }
    } else {
      createNewSession();
    }
  }, []);

  // Save Sessions
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('scraper_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: uuidv4(),
      title: 'New Scrape',
      messages: [],
      createdAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (currentSessionId === id) {
      if (newSessions.length > 0) {
        setCurrentSessionId(newSessions[0].id);
      } else {
        createNewSession();
      }
    }
    // Update local storage immediately
    localStorage.setItem('scraper_sessions', JSON.stringify(newSessions));
  };

  const getCurrentMessages = () => {
    return sessions.find(s => s.id === currentSessionId)?.messages || [];
  };

  const updateCurrentSessionMessages = (newMessages: Message[]) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: newMessages };
      }
      return s;
    }));
  };

  const updateSessionTitle = (id: string, title: string) => {
    setSessions(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, title };
      }
      return s;
    }));
  };

  const handleScrape = async (req: ScrapeRequest) => {
    if (!req.url || !currentSessionId) return;

    // Update Title if it's the first message
    const currentMessages = getCurrentMessages();
    if (currentMessages.length === 0) {
      // Simple title derived from URL
      try {
        const urlObj = new URL(req.url);
        updateSessionTitle(currentSessionId, urlObj.hostname);
      } catch {
        updateSessionTitle(currentSessionId, "Scrape Session");
      }
    }

    // Add User Message
    const userMsg: Message = {
      id: uuidv4(),
      role: 'user',
      content: `**URL:** ${req.url}\n\n**Prompt:** ${req.prompt}`,
      timestamp: Date.now(),
    };

    // Optimistic Update
    const updatedMessages = [...currentMessages, userMsg];
    updateCurrentSessionMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape');
      }

      // Add AI Response
      const aiMsg: Message = {
        id: uuidv4(),
        role: 'ai',
        content: data.result,
        timestamp: Date.now(),
      };
      updateCurrentSessionMessages([...updatedMessages, aiMsg]);

    } catch (error: any) {
      // Add Error Message
      const errorMsg: Message = {
        id: uuidv4(),
        role: 'system',
        content: `Error: ${error.message}`,
        timestamp: Date.now(),
      };
      updateCurrentSessionMessages([...updatedMessages, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={createNewSession}
        onSelectSession={setCurrentSessionId}
        onDeleteSession={deleteSession}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative h-full transition-all duration-300 ease-in-out md:ml-0">

        {/* Header (Mobile Only) */}
        <header className="md:hidden p-4 flex items-center justify-between border-b border-[var(--border)] bg-[var(--background)] z-30">
          <div className="w-8 ml-8" />
          <span className="font-heading font-medium">NexScraper AI</span>
          <div className="w-8" />
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden relative">
          <div className="h-full overflow-y-auto w-full custom-scrollbar flex flex-col items-center">
            <ChatInterface messages={getCurrentMessages()} isLoading={isLoading} />
          </div>
        </div>

        {/* Input Area */}
        <div className="w-full p-4 md:p-6 pb-8 bg-[var(--background)] z-20">
          <ScraperInput onScrape={handleScrape} isLoading={isLoading} />
        </div>

      </main>
    </div>
  );
}
