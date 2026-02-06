
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon, Minimize2 } from 'lucide-react';
import { aiService, ChatMessage } from '../../services/ai.service';
import { Store } from '../../types';

interface ChatInterfaceProps {
    store: Store | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ store }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'ai', text: 'Hi! I am ScanGo AI. Ask me about item locations, prices, or availability!', timestamp: Date.now() }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'user',
            text: inputValue,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const responseText = await aiService.processQuery(userMsg.text, store?.id || '');

            const aiMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                sender: 'ai',
                text: responseText,
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'ai', text: "Sorry, I'm having trouble connecting right now.", timestamp: Date.now() }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="absolute bottom-6 right-6 bg-[#007041] text-white p-4 rounded-full shadow-2xl z-50 hover:bg-green-800 transition-transform active:scale-95 animate-in slide-in-from-bottom-4"
                >
                    <div className="relative">
                        <MessageCircle size={28} />
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                        </span>
                    </div>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-6 right-6 w-80 md:w-full max-w-[90%] h-[500px] bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">

                    {/* Header */}
                    <div className="bg-[#007041] p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/20 p-2 rounded-xl">
                                <Bot size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">ScanGo AI</h3>
                                <p className="text-[10px] text-green-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition">
                            <Minimize2 size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'user'
                                    ? 'bg-gray-800 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask about items..."
                            className="flex-1 bg-gray-100 border-none outline-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-[#007041]/10 transition"
                            autoFocus
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="bg-[#007041] text-white p-3 rounded-xl hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
