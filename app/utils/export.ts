import { Message } from '../types';

export const exportToJSON = (messages: Message[], filename = 'scrape-session') => {
    const data = JSON.stringify(messages, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

export const exportToMarkdown = (messages: Message[], filename = 'scrape-session') => {
    let content = `# Scrape Session\n\n`;
    messages.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : msg.role === 'system' ? 'System' : 'AI';
        content += `### ${role} (${new Date(msg.timestamp).toLocaleString()})\n\n${msg.content}\n\n---\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
};
