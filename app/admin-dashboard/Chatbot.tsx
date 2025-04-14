import React, { useState } from "react";

const Chatbot: React.FC = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div>
      <div className="fixed bottom-4 right-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => setChatOpen(!chatOpen)}
        >
          💬
        </button>
      </div>
      {chatOpen && (
        <div className="fixed bottom-16 right-4 bg-white border border-gray-300 rounded-lg shadow-lg w-80 h-96 p-4 flex flex-col">
          <h2 className="text-black font-bold mb-2 ">Chatbot</h2>
          <div className="flex-grow overflow-auto mb-2">
            {/* Chat messages will go here */}
          </div>
          <div>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Type a message..."
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;