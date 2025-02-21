import midaLogo from "../assets/mida.png"; // Import the MIDA logo
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ text, sender, isThinking }) { // Added isThinking prop
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (sender === "bot") {
      setTypedText(""); // ✅ Reset text properly before typing starts

      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => {
          if (index < text.length) {
            return text.slice(0, index + 1); // ✅ Correct way to update text
          } else {
            clearInterval(interval);
            return prev;
          }
        });
        index++;
      }, 5); // Typing speed

      return () => clearInterval(interval);
    }
  }, [text, sender]);

  return (
    <div className={`flex ${sender === "user" ? "justify-end" : "justify-start"} items-start space-x-4`}>
      {sender !== "user" && (
        <img src={midaLogo} alt="MIDA Logo" className="w-8 h-8 self-start" />
      )}
      <div
        className={`rounded-lg break-words ${
          sender === "user"
            ? "bg-light-purple-2 p-3 font-poppins text-oil-black self-end max-w-[75%] md:max-w-[50%]"
            : "text-oil-black self-start font-poppins max-w-md md:max-w-lg lg:max-w-xl"
        }`}
      >
        {isThinking && sender === "bot" ? ( // Conditional rendering for thinking text
          // <p className="text-gray-500">Thinking...</p>
          <div className="flex items-center space-x-2">
            {/* Animated pulsing dot */}
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grey opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-oil-black"></span>
            </span>

            {/* Optional: You can keep the text for clarity */}
            <span className="text-grey text-sm">Thinking...</span>
          </div>
        ) : sender === "bot" ? (
          <ReactMarkdown
            components={{
              p: ({ node, ...props }) => <p className="mb-2 text-gray-900" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-2 text-gray-900" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-2 text-gray-900" {...props} />,
              li: ({ node, ...props }) => <li className="mb-1 text-gray-900" {...props} />,
              strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
              a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
            }}
            remarkPlugins={[remarkGfm]}
          >
            {typedText}
          </ReactMarkdown>
        ) : (
          text
        )}
      </div>
    </div>
  );
}





