import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as MessageType } from '../types';
import { Bot, User, Terminal } from 'lucide-react';
import ChartRenderer from './ChartRenderer';

interface MessageProps {
    message: MessageType;
}

export default function Message({ message }: MessageProps) {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    const renderContent = () => {
        if (isSystem) {
            return (
                <pre className="whitespace-pre-wrap text-xs text-foreground/80 font-mono">
                    {message.content}
                </pre>
            );
        }

        // Check for Charts
        const chartRegex = /!!!CHART_START!!!([\s\S]*?)!!!CHART_END!!!/;
        const match = message.content.match(chartRegex);

        if (match) {
            const chartJson = match[1];
            const textBefore = message.content.split('!!!CHART_START!!!')[0];
            const textAfter = message.content.split('!!!CHART_END!!!')[1] || '';

            let chartData = null;
            try {
                chartData = JSON.parse(chartJson);
            } catch (e) {
                console.error("Failed to parse chart JSON", e);
            }

            return (
                <>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{textBefore}</ReactMarkdown>
                    {chartData && <ChartRenderer data={chartData} />}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{textAfter}</ReactMarkdown>
                </>
            );
        }

        return (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
            </ReactMarkdown>
        );
    };

    return (
        <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

                {/* Avatar */}
                <div className={`
          w-10 h-10 rounded-full flex items-center justify-center shrink-0
          ${isUser ? 'bg-primary/20 text-primary border border-primary/30' :
                        isSystem ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            'bg-secondary/20 text-secondary border border-secondary/30'}
        `}>
                    {isUser ? <User size={20} /> : isSystem ? <Terminal size={20} /> : <Bot size={20} />}
                </div>

                {/* Content Bubble */}
                <div className={`
          p-4 rounded-2xl glass
          ${isUser ? 'rounded-tr-sm bg-primary/10 border-primary/20' :
                        isSystem ? 'rounded-tl-sm bg-orange-500/5 border-orange-500/20 font-mono text-sm' :
                            'rounded-tl-sm bg-secondary/5 border-secondary/20'}
        `}>
                    <div className="prose prose-invert prose-sm max-w-none">
                        {renderContent()}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-2 text-right">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );
}
