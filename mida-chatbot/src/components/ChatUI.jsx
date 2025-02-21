import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";
import axios from "axios";

export default function ChatUI() {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm here to help you with any questions you have about MIDA Malaysia and investment opportunities. Feel free to ask me anything!", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Track if the bot is responding
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Add a thinking message
    const thinkingMessage = { text: "", sender: "bot", isThinking: true };
    setMessages((prev) => [...prev, thinkingMessage]);

    try {
      // Send user message to FastAPI backend
      const response = await axios.post("http://127.0.0.1:8000/get_response", {
        user_message: input,
      });
      const botReply = { text: response.data.bot_reply, sender: "bot", isThinking: false }; // Update isThinking
      setMessages((prev) => {
        const updatedMessages = prev.slice(0, -1); // Remove the thinking message
        return [...updatedMessages, botReply]; // Add the bot reply
      });
    } catch (error) {
      console.error("Error fetching bot response:", error);
      setMessages((prev) => [...prev, { text: "Error: Unable to fetch response.", sender: "bot", isThinking: false }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto p-4 text-white">
      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 mb-20">
        {messages.map((msg, index) => (
          <MessageBubble key={index} text={msg.text} sender={msg.sender} isThinking={msg.isThinking} /> // Pass isThinking prop
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 fixed bottom-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl flex items-center rounded-xl">
        <div className="relative flex-1">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-light-purple-2 text-black border-none font-poppins p-3 pr-12 rounded-xl resize-none h-24"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault(); // Prevent new line
                sendMessage();
              }
            }}
          />
          <Button 
            onClick={sendMessage} 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black p-2 rounded-xl"
          >
            <Send size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
