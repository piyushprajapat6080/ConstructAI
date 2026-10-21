import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  HardHat,
  User,
  Sparkles,
  Copy,
  Check,
  Bot,
  RefreshCw,
  Lightbulb
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { api } from '../api/client';

const TOP_SUGGESTIONS = [
  'What is the M25 concrete mix design ratio per IS 10262?',
  'Give me the 5 mandatory safety rules for high-rise scaffolding.',
  'What are current construction rates per sqft in India for 2026?',
  'How to perform concrete pond curing properly?'
];

// Lightweight Markdown Formatter
function MarkdownContent({ content }) {
  if (!content) return null;

  // Split lines
  const lines = content.split('\n');

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Headers
        if (trimmed.startsWith('#### ')) {
          return (
            <h5 key={idx} className="font-bold text-slate-900 text-xs sm:text-sm mt-2 mb-1">
              {trimmed.replace('#### ', '')}
            </h5>
          );
        }
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-slate-900 text-sm sm:text-base text-construction-700 mt-2 mb-1">
              {trimmed.replace('### ', '')}
            </h4>
          );
        }

        // Blockquote / Warning
        if (trimmed.startsWith('> ')) {
          return (
            <blockquote
              key={idx}
              className="p-3 my-2 border-l-4 border-amber-500 bg-amber-50/80 rounded-r-lg text-amber-900 text-xs font-medium"
            >
              {trimmed.replace('> ', '')}
            </blockquote>
          );
        }

        // Bullet point
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const itemText = trimmed.substring(2);
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-construction-500 font-bold mt-0.5">•</span>
              <span
                dangerouslySetInnerHTML={{
                  __html: itemText
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
                }}
              />
            </div>
          );
        }

        // Numbered list (e.g. "1. ")
        if (/^\d+\.\s/.test(trimmed)) {
          const numMatch = trimmed.match(/^(\d+\.)\s(.*)$/);
          if (numMatch) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="font-bold text-construction-600 font-mono text-xs mt-0.5">
                  {numMatch[1]}
                </span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: numMatch[2]
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
                  }}
                />
              </div>
            );
          }
        }

        // Table row simulation
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (trimmed.includes('---')) return null; // skip markdown divider
          const cells = trimmed
            .split('|')
            .filter((c, i, arr) => i > 0 && i < arr.length - 1)
            .map((c) => c.trim());
          return (
            <div key={idx} className="grid grid-cols-3 gap-2 p-2 bg-slate-100 rounded text-xs font-mono">
              {cells.map((cell, cIdx) => (
                <span key={cIdx} className={cIdx === 0 ? 'font-bold text-slate-900' : 'text-slate-700'}>
                  {cell.replace(/\*\*/g, '')}
                </span>
              ))}
            </div>
          );
        }

        // Empty line
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Standard paragraph with bold formatting
        return (
          <p
            key={idx}
            dangerouslySetInnerHTML={{
              __html: trimmed
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
                .replace(/\*(.*?)\*/g, '<em class="italic text-slate-700">$1</em>')
            }}
          />
        );
      })}
    </div>
  );
}

export default function ChatbotView() {
  const { addToast } = useToast();
  const [messages, setMessages] = useState([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "### 👷 Welcome to CONSTRUCTAI Intelligence Chat\n\nI am your multimodal construction engineering copilot. I can assist with **IS Codes**, concrete mix proportions, BBS schedules, site safety audits, and project cost estimates.\n\nAsk me anything or select a prompt below to get started!",
      followups: [
        'M25 concrete mix ratio per IS 10262',
        'Five cardinal safety rules for high-rise sites',
        'Estimate 1500 sqft residential construction cost'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText = null) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Build history
      const history = messages.map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const response = await api.sendChatMessage(textToSend.trim(), history);

      const botMsg = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: response.reply,
        followups: response.followup_suggestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      addToast(err.message || 'Chat request failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (text) => {
    navigator.clipboard.writeText(text);
    addToast('Response copied to clipboard', 'success');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] max-h-[850px] cai-card !p-0 overflow-hidden border-slate-200 shadow-md">
      {/* Top Header / Chip Suggestions */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-construction-500">
            <HardHat className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              ConstructionGPT AI Copilot
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </h3>
            <p className="text-[11px] text-slate-500">
              Powered by Llama-3.3 70B Versatile & Indian Building Code Neural Knowledge
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
            addToast('Conversation reset', 'info');
          }}
          className="cai-btn-secondary !text-xs !py-1 !px-2.5 self-start sm:self-center"
          title="Reset Chat"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      {/* Suggestion Chips Banner */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-construction-500" />
          Suggestions:
        </span>
        {TOP_SUGGESTIONS.map((sug, i) => (
          <button
            key={i}
            onClick={() => handleSend(sug)}
            className="text-[11px] bg-white hover:bg-orange-50 hover:text-construction-600 hover:border-orange-200 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200 transition-colors shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#f8fafc]/50">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white ${
                  isUser
                    ? 'bg-slate-800'
                    : 'bg-gradient-to-br from-construction-500 to-construction-600 shadow-sm'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <HardHat className="w-4 h-4" />}
              </div>

              {/* Speech Bubble */}
              <div
                className={`relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200/80 rounded-tl-none space-y-3'
                }`}
              >
                {isUser ? (
                  <p className="text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </p>
                ) : (
                  <div>
                    <MarkdownContent content={m.text} />

                    {/* Followup suggestion pills if provided */}
                    {(m.followups || []).length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block w-full mb-1">
                          Follow-up Questions:
                        </span>
                        {m.followups.map((f, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSend(f)}
                            className="text-[11px] text-construction-700 bg-orange-50/80 hover:bg-orange-100/90 border border-orange-200 px-2 py-0.5 rounded-full transition-colors text-left"
                          >
                            → {f}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Footer Timestamp & Copy */}
                <div
                  className={`flex items-center justify-between gap-3 text-[10px] mt-2 pt-1 border-t ${
                    isUser
                      ? 'border-slate-800 text-slate-400'
                      : 'border-slate-100 text-slate-400'
                  }`}
                >
                  <span>{m.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => copyMessage(m.text)}
                      className="hover:text-slate-700 p-0.5 rounded transition-colors flex items-center gap-1"
                      title="Copy response"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator Bubble */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-construction-500 to-construction-600 flex items-center justify-center flex-shrink-0 text-white">
              <HardHat className="w-4 h-4 animate-bounce" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-construction-500 animate-ping" />
              <span className="text-xs font-medium text-slate-500">
                Reasoning over IS Codes & structural standards...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a construction question, rate query, or structural problem..."
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-construction-500/20 focus:border-construction-500 transition-all font-medium"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="cai-btn-primary !p-3 !rounded-xl"
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          CONSTRUCTAI is an AI engineering assistant. Verify critical calculations with a licensed structural engineer.
        </p>
      </div>
    </div>
  );
}
