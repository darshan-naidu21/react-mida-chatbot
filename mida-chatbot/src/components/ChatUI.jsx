import { useState, useRef, useEffect } from "react"
import MessageBubble from "./MessageBubble"
import axios from "axios"
import { ScrollArea } from "@/components/ui/scroll-area"
import background from "../assets/background.png"
import niseLogo from "../assets/nise.png"
import { ArrowUp } from "lucide-react"

export default function ChatUI() {
  const [messages, setMessages] = useState([
    {
      text: "Hey there! I'm here to help with any questions about MIDA Malaysia and investment opportunities. Just ask away!",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading || isTyping) return

    const userMessage = { text: input, sender: "user" }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      await axios.get("http://127.0.0.1:8000/healthcheck", { timeout: 3000 })

      const thinkingMessage = { text: "", sender: "bot", isThinking: true }
      setMessages((prev) => [...prev, thinkingMessage])

      const response = await axios.post("http://127.0.0.1:8000/get_response", {
        user_message: input,
      })

      const botReply = { text: response.data.bot_reply, sender: "bot", isThinking: false }
      setMessages((prev) => {
        const updatedMessages = prev.slice(0, -1)
        return [...updatedMessages, botReply]
      })
      setIsTyping(true)
    } catch (error) {
      console.error("Error fetching bot response:", error)
      setMessages((prev) => [...prev, { text: "Error: Unable to fetch response.", sender: "bot", isThinking: false }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen text-foreground bg-cover" style={{ backgroundImage: `url(${background})` }}>
      <header className="sticky top-0 z-10 text-purple text-3xl font-bold font-poppins py-4 px-6 flex justify-center items-center">
        <div className="flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            fill="none"
            viewBox="0 0 128 128"
            id="robot"
            className="mr-2"
          >
            <rect width="75" height="66" x="26" y="30" stroke="#3d1482" strokeWidth="7" rx="18"></rect>
            <path
              stroke="#3d1482"
              strokeLinecap="round"
              strokeWidth="7"
              d="M73 77H51M102 54L112 54M26 54L16 54M112 60L112 48M16 60L16 48"
            ></path>
            <path
              fill="#3d1482"
              d="M40.5 53C40.5 57.6944 44.3056 61.5 49 61.5V54.5C48.1716 54.5 47.5 53.8284 47.5 53H40.5zM49 61.5C53.6944 61.5 57.5 57.6944 57.5 53H50.5C50.5 53.8284 49.8284 54.5 49 54.5V61.5zM57.5 53C57.5 48.3056 53.6944 44.5 49 44.5V51.5C49.8284 51.5 50.5 52.1716 50.5 53H57.5zM49 44.5C44.3056 44.5 40.5 48.3056 40.5 53H47.5C47.5 52.1716 48.1716 51.5 49 51.5V44.5zM69.5 53C69.5 57.6944 73.3056 61.5 78 61.5V54.5C77.1716 54.5 76.5 53.8284 76.5 53H69.5zM78 61.5C82.6944 61.5 86.5 57.6944 86.5 53H79.5C79.5 53.8284 78.8284 54.5 78 54.5V61.5zM86.5 53C86.5 48.3056 82.6944 44.5 78 44.5V51.5C78.8284 51.5 79.5 52.1716 79.5 53H86.5zM78 44.5C73.3056 44.5 69.5 48.3056 69.5 53H76.5C76.5 52.1716 77.1716 51.5 78 51.5V44.5z"
            ></path>
          </svg>
          MIDA AI Assist
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto w-full p-4 space-y-4 mb-[120px]">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              text={msg.text}
              sender={msg.sender}
              isThinking={msg.isThinking}
              setIsTyping={setIsTyping}
            />
          ))}
          {loading && (
            <div className="flex justify-center">
              <div className="loader"></div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </ScrollArea>

      <div className="sticky bottom-14 left-0 right-0 px-4">
        <div className="max-w-4xl mx-auto cursor-text bg-light-purple-2 p-4 rounded-xl" onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("chatInput")?.focus(); // Focus the textarea
                }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className={`flex flex-col ${loading || isTyping ? 'opacity-50' : ''}`}
            disabled={loading || isTyping}
          >
            <textarea
              id="chatInput"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about MIDA"
              className="w-full bg-transparent text-oil-black font-poppins border-none outline-none resize-none overflow-y-auto mb-2 p-0 text-base md:text-lg placeholder:text-base placeholder:md:text-lg min-h-[80px] sm:min-h-[100px] md:min-h-[100px] lg:min-h-[100px]"
              rows={1}
              disabled={loading || isTyping}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
            />
            <div className="flex justify-end" onClick={(e) => {
                  e.preventDefault()
                }}>
              <div
                role="button"
                onClick={(e) => {
                  e.preventDefault()
                  sendMessage()
                }} 
                className="rounded-full flex bg-oil-black justify-center items-center hover:opacity-50 transition-opacity duration-200"
                aria-disabled={loading || isTyping}
                style={{
                  cursor: loading || isTyping ? 'not-allowed' : 'pointer',
                  pointerEvents: loading || isTyping ? 'none' : 'auto',
                  width: '10vw', // Responsive width
                  height: '10vw', // Responsive height
                  maxWidth: '42px', // Maximum width
                  maxHeight: '42px', // Maximum height
                }}
              >
                <ArrowUp size="50%" color="#ffffff" />
              </div>
            </div>
          </form>
        </div>
      </div>

      <footer className="text-purple font-poppins w-full py-3 fixed bottom-0 left-0 right-0 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <p className="text-sm md:text-base font-semibold">&copy; 2025 NiSE Insight. All rights reserved.</p>
          <img src={niseLogo || "/placeholder.svg"} alt="NiSE Insight Logo" className="h-8 w-auto" />
        </div>
      </footer>
    </div>
  )
}





