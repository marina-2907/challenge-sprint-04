import { useState, useRef, useEffect } from "react";

export function Chat() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { text: input, sender: "user" }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Obrigado por sua mensagem! Em breve responderemos.", sender: "bot" },
      ]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
   
    <main className="font-sans flex flex-col max-w-2xl mx-auto my-44 px-5 py-5 bg-gradient-to-b from-slate-50 to-white rounded-3xl shadow-2xl border border-slate-100">
      <h1 className="text-center text-4xl font-extrabold text-blue-900 mb-8 drop-shadow-sm">
        Nosso Chat
      </h1>

      {/* Área de mensagens */}
      <div className="flex-1 bg-white rounded-2xl p-4 overflow-y-auto mb-6 shadow-inner min-h-[240px] border border-slate-200">
        {messages.length === 0 && (
          <p className="text-center text-gray-500 text-base mt-8">
            Nenhuma mensagem ainda. Envie algo! 💬
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-base leading-relaxed break-words mb-3 animate-fadeIn
              ${msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto rounded-br-sm shadow-md"
                : "bg-slate-200 text-gray-800 mr-auto rounded-bl-sm shadow-sm"
              }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input e botão */}
      <div className="flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 px-4 py-3 rounded-full border border-slate-300 text-base focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-full text-base shadow-lg hover:bg-blue-800 hover:-translate-y-0.5 transition-transform"
        >
          Enviar
        </button>
      </div>
    </main>
  );
}
