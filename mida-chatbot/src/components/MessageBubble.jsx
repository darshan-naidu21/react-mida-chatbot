import midaLogo from "../assets/mida.png"; // Import the MIDA logo
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ text, sender, isThinking, setIsTyping }) { // Added isThinking prop
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    if (sender === "bot") {
      setTypedText(""); // ✅ Reset text properly before typing starts
      setIsTyping(true);

      const words = text.split(" ");
      let index = 0;
      const interval = setInterval(() => {
        setTypedText((prev) => {
          if (index < words.length) {
            return words.slice(0, index + 1).join(" "); // ✅ Correct way to update text by words
          } else {
            clearInterval(interval);
            setIsTyping(false);
            return prev;
          }
        });
        index++;
      }, 30); // Typing speed for words

      return () => {
        clearInterval(interval);
        setIsTyping(false); // Ensure cleanup
      };
    }
  }, [text, sender, setIsTyping]);


  const isUser = sender === "user";
  const isBot = sender === "bot";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} items-start space-x-4 mb-8`}>
      {!isUser && (
        <img src={midaLogo} alt="MIDA Logo" className="w-10 h-10 self-start" />
      )}

      <div
        className={`rounded-lg break-words ${
          isUser
            ? "bg-light-purple-2 p-3 font-poppins text-oil-black self-end max-w-[90%] md:max-w-[70%] text-base md:text-lg"
            : "text-oil-black self-start font-poppins w-full text-base md:text-lg"
        }`}
      >
        {isThinking && isBot ? (
          <div className="flex items-center space-x-2">
            <span className="relative flex h-5 w-5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-grey opacity-75"></span>
              <span className="relative inline-flex h-5 w-5 rounded-full bg-oil-black"></span>
            </span>
            <span className="text-grey text-md font-poppins">Thinking...</span>
          </div>
        ) : isBot ? (
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





