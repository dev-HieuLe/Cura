import { useState } from "react";
import { MessageSquare, User, Heart } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionId] = useState(() => uuidv4());

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/gemini-chat/message`,
        {
          sessionId,
          message: input,
        }
      );

      setMessages([...newMessages, { role: "ai", content: res.data.message }]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...newMessages,
        { role: "ai", content: "Error sending message." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <MessageSquare className="text-white w-7 h-7" />
      </button>

      {/* Chat popup */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 max-w-full bg-white rounded-xl shadow-xl flex flex-col overflow-hidden z-50 h-[60vh]">
          {/* Header */}
          <div className="bg-red-600 text-white px-4 py-2 font-bold flex items-center gap-2">
            <Heart className="w-5 h-5" />
            AI Doctor
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-96 h-full space-y-3 flex flex-col">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm self-center mt-5">
                Say hello to start the chat!
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className="flex items-start gap-2">
                {/* Avatar */}
                <div>
                  {msg.role === "user" ? (
                    <User className="w-6 h-6 text-red-600" />
                  ) : (
                    <Heart className="w-6 h-6 text-red-600" />
                  )}
                </div>

                {/* Message content */}
                <div
                  className={`px-3 py-2 rounded-lg max-w-[70%] ${
                    msg.role === "user"
                      ? "bg-red-100 self-end text-right"
                      : "bg-gray-100 self-start text-left"
                  }`}
                >
                  <div className="text-xs text-gray-500 font-semibold mb-1">
                    {msg.role === "user" ? "You" : "AI Doctor"}
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}

            {/* Loading / AI thinking animation */}
            {loading && (
              <div className="flex items-start gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                <div className="bg-gray-100 px-3 py-2 rounded-lg max-w-[70%] animate-pulse text-sm text-gray-500">
                  AI Doctor is typing...
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="p-2 border-t border-gray-300 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              onClick={handleSendMessage}
              className="bg-red-600 text-white px-4 rounded hover:bg-red-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
