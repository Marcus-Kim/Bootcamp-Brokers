import React, {useState, useEffect} from 'react'
import './ChatBubble.css'
import Bubble from './chat.png'
import { useSelector, useDispatch } from 'react-redux';

export default function ChatBubble({ isChatModalOpen, setIsChatModalOpen }) {
    const [chatHistory, setChatHistory] = useState([])
    const [inputValue, setInputValue] = useState("")
    const currentDate = new Date().toLocaleDateString
    const [isLoading, setIsLoading] = useState(false)

    const handleChatClick = () => {
      setIsChatModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsChatModalOpen(false);
    };

    const sendMessage = async() => {

        // add the user's message to the chat log array
        setChatHistory((prevMessages) => [
            ...prevMessages,
            {
                text: inputValue,
                isUser: true
            }
        ]);

        const headers = {
            "Content-Type": "application/json",
        };

    const body = JSON.stringify({
        user_id: 1,
        message: inputValue
    })

    setIsLoading(true);

    try {
        const response = await fetch(
            "/api/messages/",
            {
                method: "POST",
                headers,
                body,
            }
        )

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        setIsLoading(false);

        const responseData = await response.json();
        const botResponse = responseData.message;
        setChatHistory((prevMessages) => [
          ...prevMessages,
          {
            text: botResponse,
            isUser: false,
          },
        ]);

        // If the message was stored successfully, clear the input field
        setInputValue("")
        } catch (error) {
          console.error("Error:", error);
          setIsLoading(false);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();
        sendMessage();
        setInputValue("");
    };

      const handleChange = e => {
        setInputValue(e.target.value);
      };



    return (
      <div className="chat-container">
      {isChatModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="chat-header">
              <h2>Chat with Sydney</h2>
              <button onClick={handleCloseModal}>Close</button>
            </div>
            <div className="chat-body">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={message.isUser ? 'message user' : 'message bot'}
                >
                  {message.text}
                </div>
              ))}
              {isLoading && <div className="message loading">Loading...</div>}
            </div>
            <div className="chat-footer">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={inputValue}
                  onChange={handleChange}
                />
                <button type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="chat-icon" onClick={handleChatClick}>
        <img src={Bubble} alt="Chat Icon" />
      </div>
    </div>
    )
}
