import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
// Keep model credentials on this server endpoint; VITE_* values are public.
const CHAT_ENDPOINT = import.meta.env.VITE_CHAT_ENDPOINT;

const MODEL = "gemini-3.8-flash";
const MAX_REQUESTS = 6;

const SYSTEM_PROMPT = `
You are Pulse, the AI assistant on Prince Soni's portfolio website.
Be warm, concise, professional, and helpful.
Answer questions about Prince's portfolio, skills, projects, and experience.
Use only information provided in the conversation or explicitly included in the portfolio context.
Do not invent employment history, project results, dates, skills, contact details, or availability.
If you do not have enough information, say so briefly and direct the visitor to the portfolio's contact section.
For unrelated questions, politely explain that you can help with Prince's portfolio.
Do not claim to have performed actions you have not performed.
`;

const SUGGESTIONS = [
  "What's your tech stack?",
  "Tell me about your projects",
  "Who are you, Pulse?",
  "Are you open to work?",
];

function PulseIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 12h4l2 8 4-16 2 8h6" />
    </svg>
  );
}

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hey, I'm Pulse — Prince's AI assistant. Ask me about his stack, projects, or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [requestCount, setRequestCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inFlightRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isTyping]);

  useEffect(() => {
    const handleOpenPulse = () => {
      setIsOpen(true);
      setShowTooltip(false);
    };
    window.addEventListener("open-pulse", handleOpenPulse);
    return () => window.removeEventListener("open-pulse", handleOpenPulse);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (!sessionStorage.getItem("pulseTooltipShown")) {
        setShowTooltip(true);
        sessionStorage.setItem("pulseTooltipShown", "true");
        const timer = window.setTimeout(() => setShowTooltip(false), 6000);
        return () => window.clearTimeout(timer);
      }
    } catch {
      // Storage can be unavailable in privacy-restricted browser contexts.
    }
  }, []);

  const handleSend = async (event, forcedInput = null) => {
    event?.preventDefault();

    const userMsg = (forcedInput ?? input).trim();
    if (!userMsg || inFlightRef.current) return;

    if (!CHAT_ENDPOINT) {
      setMessages((prev) => [
        ...prev,
        { role: "user", text: userMsg },
        {
          role: "bot",
          text: "Pulse is temporarily unavailable. Please use the contact section to reach Prince directly.",
        },
      ]);
      setInput("");
      return;
    }

    if (requestCount >= MAX_REQUESTS) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "You've reached the chat limit for this session. Please use the contact section for further questions.",
        },
      ]);
      return;
    }

    inFlightRef.current = true;
    setInput("");
    setIsTyping(true);
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);

    try {
      // Include recent conversation turns so follow-up questions retain context.
      const history = messages
        .filter((message) => message.role === "user" || message.role === "bot")
        .slice(-10)
        .map(
          (message) =>
            `${message.role === "user" ? "Visitor" : "Pulse"}: ${message.text}`,
        )
        .join("\n");

      const prompt = `${SYSTEM_PROMPT}

Recent conversation:
${history || "(No previous conversation)"}

Visitor: ${userMsg}
Pulse:`;

      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, input: prompt }),
      });
      if (!response.ok) throw new Error(`Chat endpoint returned ${response.status}.`);
      const result = await response.json();

      const answer =
        typeof result.output_text === "string"
          ? result.output_text.trim()
          : typeof result.answer === "string"
            ? result.answer.trim()
            : "";

      if (!answer) {
        throw new Error("The model returned an empty response.");
      }

      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
      setRequestCount((count) => count + 1);
    } catch (error) {
      console.error("Pulse request failed:", error);
      const detail = error?.message?.includes("404")
        ? "The configured AI provider or model is unavailable. Please check the server configuration."
        : error?.message?.includes("429")
          ? "The AI service is temporarily rate-limited. Please try again later."
          : "I couldn't connect to the AI service. Please try again in a moment.";

      setMessages((prev) => [...prev, { role: "bot", text: detail }]);
    } finally {
      inFlightRef.current = false;
      setIsTyping(false);
    }
  };

  return (
    <div
      className="fixed right-4 sm:right-5 md:right-8 z-50 flex flex-col items-end pointer-events-none"
      style={{ bottom: "calc(1.1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: "spring", damping: 22, stiffness: 220 }}
            className="mb-4 w-[calc(100vw-2.5rem)] sm:w-96 max-h-[560px] rounded-3xl overflow-hidden flex flex-col pointer-events-auto relative"
            style={{
              background: "var(--color-primary)",
              border: "1px solid var(--color-border-strong)",
              boxShadow:
                "0 24px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,51,51,0.08)",
              height: "70vh",
              maxHeight: "min(560px, 70dvh)",
            }}
            role="dialog"
            aria-label="Pulse AI assistant"
          >
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-red/20 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex items-center justify-between px-5 py-4 border-b border-border-strong/60 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-full flex items-center justify-center bg-red/10 border border-red/40">
                  <PulseIcon className="w-4 h-4 text-red" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm text-accent leading-tight">
                    Pulse
                  </div>
                  <div className="text-[10px] text-muted font-mono tracking-wide">
                    AI Assistant
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted hover:text-red hover:bg-red/10 transition-all duration-300"
                aria-label="Close chat"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="6" />
                </svg>
              </button>
            </div>

            <div
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 text-sm relative z-10 custom-scrollbar"
              aria-live="polite"
            >
              {messages.map((msg, idx) => (
                <motion.div
                  key={`${idx}-${msg.role}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words px-4 py-2.5 leading-relaxed ${
                      msg.role === "user"
                        ? "bg-red text-white rounded-2xl rounded-br-md"
                        : "bg-secondary text-accent rounded-2xl rounded-bl-md border border-border-strong/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div
                  className="flex justify-start"
                  aria-label="Pulse is typing"
                >
                  <div className="px-4 py-3 bg-secondary rounded-2xl rounded-bl-md border border-border-strong/50 flex items-center gap-1.5">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        className="w-1.5 h-1.5 bg-red rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {requestCount < MAX_REQUESTS &&
              messages.length < 4 &&
              !isTyping && (
                <div className="flex flex-wrap gap-2 px-4 pb-3 relative z-10">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      type="button"
                      key={suggestion}
                      onClick={() => handleSend(null, suggestion)}
                      className="text-[11px] rounded-full border border-border-strong/60 text-muted px-3 py-1.5 hover:border-red hover:text-red hover:bg-red/5 transition-all duration-300"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}

            <form
              onSubmit={handleSend}
              className="px-4 pb-4 pt-2 flex gap-2 relative z-10"
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Pulse about Prince..."
                className="min-w-0 flex-1 bg-secondary border border-border-strong/60 rounded-full px-4 py-2.5 text-sm text-accent focus:outline-none focus:border-red transition-all duration-300"
                aria-label="Message Pulse"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-10 h-10 shrink-0 rounded-full bg-red text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform duration-300"
                aria-label="Send message"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isOpen && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-3 mr-1 pointer-events-none"
          >
            <span className="text-xs font-medium text-accent bg-primary px-3 py-2 rounded-xl border border-border-strong/60 shadow-lg inline-block">
              👋 Chat with Pulse
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setIsOpen((open) => !open);
          setShowTooltip(false);
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red text-white flex items-center justify-center pointer-events-auto relative"
        style={{ boxShadow: "0 8px 30px -6px rgba(255,51,51,0.6)" }}
        title="Ask Pulse"
        aria-label={isOpen ? "Close Pulse chat" : "Open Pulse chat"}
      >
        <span className="absolute inset-0 rounded-full bg-red animate-ping opacity-20" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="6" />
            </motion.svg>
          ) : (
            <motion.div
              key="icon"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PulseIcon className="w-6 h-6 md:w-7 md:h-7" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
