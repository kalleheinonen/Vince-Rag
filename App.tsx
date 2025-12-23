
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, RagRequest, Keyword, RagResponse } from './types';
import { queryRagEngine } from './services/geminiService';
import { THEME_COLORS } from './constants';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [topK, setTopK] = useState(3);
  
  // RAG Filters (Keywords)
  const [partner, setPartner] = useState('_any');
  const [country, setCountry] = useState('_any');
  const [city, setCity] = useState('_any');

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Build course-compliant request
    const keywords: Keyword[] = [
      { Key: '_model', Value: '_local' },
      { Key: '_partner', Value: partner },
      { Key: '_country', Value: country },
      { Key: '_city', Value: city },
    ];

    const request: RagRequest = {
      question: input,
      top_k: topK,
      keywords,
    };

    try {
      const response: RagResponse = await queryRagEngine(request);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      {/* Sidebar - Config */}
      <aside className="w-full md:w-80 bg-slate-900 text-white p-6 flex flex-col border-r border-slate-700 shadow-xl z-10">
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-yellow-500 text-slate-900 p-2 rounded-lg font-bold">VINCE</div>
            <h1 className="text-xl font-bold">RAG Engine</h1>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Engine Settings</label>
                <div className="space-y-4 bg-slate-800/50 p-4 rounded-xl">
                    <div>
                        <label className="text-xs text-slate-500 uppercase tracking-wider block mb-1">Top-K Retrieval</label>
                        <input 
                            type="range" min="1" max="10" value={topK} 
                            onChange={(e) => setTopK(parseInt(e.target.value))}
                            className="w-full accent-yellow-500"
                        />
                        <div className="text-right text-xs text-yellow-500">{topK} sources</div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Filters (Keywords)</label>
                <div className="space-y-3">
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <label className="text-[10px] text-slate-500 uppercase block mb-1">Partner</label>
                        <select 
                            value={partner} onChange={(e) => setPartner(e.target.value)}
                            className="bg-transparent w-full focus:outline-none text-sm"
                        >
                            <option value="_any">Any</option>
                            <option value="_tuas">Turku AMK</option>
                            <option value="_migri">Migri (FI)</option>
                            <option value="_konsumentverket">Agency (SE)</option>
                            <option value="_youmo">Youmo</option>
                        </select>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <label className="text-[10px] text-slate-500 uppercase block mb-1">Country</label>
                        <select 
                            value={country} onChange={(e) => setCountry(e.target.value)}
                            className="bg-transparent w-full focus:outline-none text-sm"
                        >
                            <option value="_any">Any</option>
                            <option value="_finland">Finland</option>
                            <option value="_sweden">Sweden</option>
                        </select>
                    </div>

                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                        <label className="text-[10px] text-slate-500 uppercase block mb-1">City</label>
                        <select 
                            value={city} onChange={(e) => setCity(e.target.value)}
                            className="bg-transparent w-full focus:outline-none text-sm"
                        >
                            <option value="_any">Any</option>
                            <option value="_turku">Turku</option>
                            <option value="_salo">Salo</option>
                            <option value="_karlstad">Karlstad</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-[10px] text-slate-500">
            <p>VIRTUAL INTEGRATION HOME PROJECT</p>
            <p className="mt-1">YINTE(B)S • Full-stack Collaboration</p>
        </div>
      </aside>

      {/* Main Content - Chat */}
      <main className="flex-1 flex flex-col bg-white relative">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white/80 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-slate-700">Student Assistant Active</span>
            </div>
            <div className="flex gap-4">
                <button 
                    onClick={() => setMessages([])}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Clear Chat"
                >
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
        </header>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-robot text-2xl"></i>
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome to the VINCE Assistant</h2>
                <p className="text-slate-500 text-sm">
                    Ask questions about student benefits, residence permits, or consumer rights in Finland and Sweden. Use the sidebar to refine your retrieval parameters.
                </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
              }`}>
                <div className="text-sm whitespace-pre-wrap">
                    {msg.content}
                </div>
                
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-300/50">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider block mb-2">
                        <i className="fas fa-book-open mr-1"></i> Sources
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {msg.sources.map((src, i) => (
                            <div key={i} className="bg-white/80 border border-slate-200 rounded-md p-2 text-[11px] text-slate-600 flex flex-col gap-1 hover:shadow-md transition-shadow">
                                <span className="font-bold text-blue-800 truncate max-w-[150px]">{src.file}</span>
                                <div className="flex justify-between items-center text-[10px] text-slate-400">
                                    <span>Page: {src.page || 'N/A'}</span>
                                    <span className="bg-green-100 text-green-700 px-1 rounded">{(src.similarity * 100).toFixed(1)}% match</span>
                                </div>
                            </div>
                        ))}
                    </div>
                  </div>
                )}
                <div className={`text-[9px] mt-2 ${msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-200 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <footer className="p-4 md:p-6 border-t bg-slate-50">
          <div className="max-w-4xl mx-auto flex gap-3 bg-white p-2 rounded-2xl shadow-inner border border-slate-200">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me something about integration..."
              className="flex-1 px-4 py-2 focus:outline-none text-slate-700 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          <div className="text-[10px] text-center mt-3 text-slate-400">
            Complies with YINTE(B)S Full-stack RAG Specification v1.0 • Gemini API Integration
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
