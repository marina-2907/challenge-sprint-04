import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

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
        {
          text:
            "Obrigado por sua mensagem! Em breve nossa equipe retorna por aqui ou por e-mail.",
          sender: "bot",
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <main className="font-sans min-h-screen bg-gradient-to-b from-slate-50 to-white px-6 py-12">
      <section className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 text-orange-700 px-4 py-1.5 border border-orange-200">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            <span className="text-[13px] font-semibold tracking-wide">Nosso Chat</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-[#0f1c3a]">
            Fale com a gente
          </h1>
          <p className="mt-2 text-slate-600">
            Deixe sua mensagem. Normalmente respondemos em poucos minutos.
          </p>
        </div>

        {/* Janela do chat */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden">
          <div className="h-[420px] overflow-y-auto p-5 bg-white">
            {messages.length === 0 && (
              <p className="text-center text-slate-500 mt-10">
                Nenhuma mensagem ainda. Envie algo! 💬
              </p>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-[15px] leading-relaxed break-words mb-3
                  ${msg.sender === "user"
                    ? "bg-[#0f1c3a] text-white ml-auto rounded-br-sm shadow-md"
                    : "bg-slate-100 text-slate-800 mr-auto rounded-bl-sm shadow-sm"}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite sua mensagem..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-[15px]
                           focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-200"
              />
              <button
                onClick={sendMessage}
                className="inline-flex items-center gap-2 bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl
                           hover:bg-orange-700 transition shadow-lg"
              >
                Enviar <Send size={18} className="opacity-90" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
