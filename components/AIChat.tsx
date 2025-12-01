import React, { useState } from 'react';
import { Pet } from '../types';
import { getPetAdvice } from '../services/geminiService';

interface AIChatProps {
  pets: Pet[];
}

const AIChat: React.FC<AIChatProps> = ({ pets }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Hallo! Ich bin dein KI-Assistent für Tierpflege. Wie kann ich dir heute helfen?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    // Context string construction
    const petContext = pets.map(p => `${p.name} (${p.type}, ${p.age} Jahre)`).join(', ');
    
    const response = await getPetAdvice(userMsg, petContext);
    
    setMessages(prev => [...prev, { sender: 'ai', text: response }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] pb-safe bg-gray-50">
       <div className="bg-white p-4 shadow-sm z-10">
         <h2 className="text-xl font-bold text-teal-700 flex items-center gap-2">
           <i className="fas fa-robot"></i> Smart Vet Ratgeber
         </h2>
         <p className="text-xs text-gray-500 mt-1">
           Powered by Gemini AI. Bitte bei Notfällen immer einen Arzt aufsuchen.
         </p>
       </div>

       <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map((msg, idx) => (
           <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
               msg.sender === 'user' 
                 ? 'bg-teal-600 text-white rounded-br-none' 
                 : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-none'
             }`}>
               {msg.text}
             </div>
           </div>
         ))}
         {loading && (
           <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
               <div className="flex gap-1">
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                 <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
               </div>
             </div>
           </div>
         )}
       </div>

       <div className="p-4 bg-white border-t border-gray-200 mb-16">
         <div className="flex gap-2">
           <input
             type="text"
             value={input}
             onChange={e => setInput(e.target.value)}
             onKeyDown={e => e.key === 'Enter' && handleSend()}
             placeholder="Frage etwas über dein Haustier..."
             className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
           />
           <button 
             onClick={handleSend}
             disabled={loading}
             className="w-12 h-12 bg-teal-600 rounded-full text-white flex items-center justify-center hover:bg-teal-700 transition disabled:opacity-50"
           >
             <i className="fas fa-paper-plane"></i>
           </button>
         </div>
       </div>
    </div>
  );
};

export default AIChat;