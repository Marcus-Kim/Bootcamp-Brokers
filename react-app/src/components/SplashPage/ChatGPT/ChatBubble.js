import React, {useState, useEffect} from 'react'
import './ChatBubble.css'
import Bubble from './chat.png'



const { Configuration, OpenAIApi } = require("openai");
const openaiApiKey = process.env.OPENAI_API_KEY || "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"

const configuration = new Configuration({
  apiKey: openaiApiKey,
});
const openai = new OpenAIApi(configuration);


export default function ChatBubble() {
    const [chatHistory, setChatHistory] = useState([])
    const [inputValue, setInputValue] = useState("")
    const currentDate = new Date().toLocaleDateString
    const [isModalOpen, setIsModalOpen] = useState(false);
    

    const handleChatClick = () => {
      setIsModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const sendMessage = async(chatHistory) => {

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
            "User-Agent": "OpenAI-API-Client",
            Authorization: `Bearer ${openaiApiKey}`,
        };

    const body = JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system", 
                content: `Sydney is a chatbot that is helpful, creative, clever, and very friendly and loves to assist people on the financial stock trading website Bootcamp Brokers:`
            },
            {
              role: 'user',
              content: inputValue
            }
            // {
            //     role: "user",
            //     content: "Hello who are you?"
            // },
            // {
            //     role: "assistant",
            //     content: "I am Sydney an intelligent chatbot that would love to help you with any needs you have."
            // },
            // {
            //     role: "user",
            //     content: "What can you do on this website?"
            // },
            // {
            //     role: "assistant",
            //     content: "You can buy and sell stocks and crypto. You can open a credit card with us. We make the financial world easy for you. "
            // },

        ],
        temperature: 1,
        n: 2,
        max_tokens: 150,
        frequency_penalty: 0.0,
        presence_penalty: 0.6,
    })

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers,
                body,
            }
        )
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json()
        console.log(data, 'data')

        setChatHistory((prevMessages) => [
            ...prevMessages,
            { text: data.choices[0].message.content, isUser: false },
          ]);
        } catch (error) {
          console.error("Error:", error);
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
      {isModalOpen && (
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


