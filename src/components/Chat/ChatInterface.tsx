import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  Bot,
  Minimize2,
  Mic,
  MicOff,
  Paperclip,
} from "lucide-react";
import { aiService, ChatMessage } from "../../services/ai.service";
import { Store } from "../../types";

interface ChatInterfaceProps {
  store: Store | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ store }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi! I am ScanGo AI. Ask me about item locations, prices, or availability!",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      // Automatically inform the user that file is attached
      const systemMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: `Attached file: ${file.name}. You can now ask me to analyze this list or find these items in the store.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, systemMsg]);
    };

    if (file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      // For PDF/DOC, in a real app we'd use a library. 
      // For this hackathon/demo, we'll simulate text extraction or notify the user.
      setFileContent(`[Simulated extraction from ${file.name}]`);
      const systemMsg: ChatMessage = {
        id: Date.now().toString(),
        sender: "ai",
        text: `I've received ${file.name}. Note: Advanced PDF/DOC extraction is simulated in this demo. I will try to match items based on the filename or common patterns.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, systemMsg]);
    }

    // Reset input value so the same file can be selected again
    e.target.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const file = new File([audioBlob], "recording.wav", { type: "audio/wav" });
        setIsTyping(true);
        const transcript = await aiService.transcribeAudio(file);
        if (transcript) {
          setInputValue(transcript);
          // Automatically send the message after transcription
          handleSend(transcript);
        }
        setIsTyping(false);
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Microphone access is required for voice commands.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const speak = (text: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || inputValue;
    if (typeof textToSend !== "string" || !textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      text: textToSend,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const responseText = await aiService.processQuery(userMsg.text, store?.id || "", fileContent || undefined);

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      speak(responseText);
      
      // Reset file after sending
      setFileContent(null);
      setFileName(null);
    } catch (err) {
      const errorMsg = "Sorry, I'm having trouble connecting right now.";
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), sender: "ai", text: errorMsg, timestamp: Date.now() },
      ]);
      speak(errorMsg);
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
          className="absolute bottom-28 right-6 bg-primary text-white size-14 rounded-full shadow-2xl z-50 hover:bg-green-800 transition-transform active:scale-95 animate-in slide-in-from-bottom-4 flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-3xl">support_agent</span>
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
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <Minimize2 size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === "user"
                    ? "bg-gray-800 text-white rounded-tr-none"
                    : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                    }`}
                >
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
            <button
              onClick={toggleListening}
              className={`p-3 rounded-xl transition shadow-md ${isListening
                ? "bg-red-500 text-white animate-pulse"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              title={isListening ? "Stop listening" : "Start voice-to-text"}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
            </button>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening... Speak now!" : "Ask about items..."}
              className={`flex-1 border-none outline-none rounded-xl px-4 py-3 text-sm font-medium transition ${isListening
                ? "bg-red-50 ring-2 ring-red-200"
                : "bg-gray-100 focus:ring-2 focus:ring-[#007041]/10"
                }`}
              autoFocus
            />
            <button
              onClick={() => handleSend()}
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
