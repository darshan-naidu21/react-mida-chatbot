import ChatUI from "./components/ChatUI";
import background from "./assets/background.png";
import niseLogo from "./assets/nise.png";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url(${background})` }}>
      
      <header className="text-purple bg-pur py-4 text-center text-4xl font-bold font-poppins fixed top-0 left-0 w-full z-50">
        MIDA Conversational Chatbot
      </header>

      <div className="flex-1 flex justify-center pt-16 pb-16 w-full max-h-[calc(100vh-6rem-4rem)] overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col flex-grow px-4">
          <ChatUI />
        </div>
      </div>

      <footer className="bg-pur text-white w-full py-4 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto flex items-center justify-center space-x-4">
          <p className="text-sm text-light-purple font-semibold font-poppins">
              &copy; 2025 NiSE Insight. All rights reserved.
          </p>
          <img src={niseLogo} alt="Company Logo" className="h-8 w-auto" />
        </div>
      </footer>
    </div>
  );
}

export default App;
