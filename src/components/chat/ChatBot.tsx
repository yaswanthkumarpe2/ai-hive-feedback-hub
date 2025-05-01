
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { MessageCircle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import LoadingIndicator from "./LoadingIndicator";
import ChatInput from "./ChatInput";
import { Message } from "./types";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your community feedback assistant powered by Gemini AI. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState<string | null>(localStorage.getItem("gemini-api-key"));
  const [showApiKeyInput, setShowApiKeyInput] = useState(!apiKey);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSaveApiKey = (key: string) => {
    localStorage.setItem("gemini-api-key", key);
    setApiKey(key);
    setShowApiKeyInput(false);
    toast.success("API key saved! You can now use the chatbot.");
  };

  useEffect(() => {
    // Send welcome message when chat opens
    if (isOpen && !showApiKeyInput) {
      // Only send greeting if we have the API key
      if (messages.length === 1) { // Only has the initial welcome message
        // No need to send an automatic message - we already have the welcome message
      }
    }
  }, [isOpen, messages.length, showApiKeyInput]);

  const generateGeminiResponse = async (prompt: string): Promise<string> => {
    if (!apiKey) return "Please provide a valid Gemini API key to continue.";

    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { 
                  text: `As a community feedback assistant for an AI platform, respond to the following user message: "${prompt}"`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("Gemini API error:", data.error);
        return `Error: ${data.error.message || "Failed to generate response"}`;
      }

      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        return "I couldn't generate a response. Please try again.";
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return "Sorry, I encountered an error while processing your request. Please try again later.";
    }
  };

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage ?? message;

    if (!textToSend.trim()) return;
    
    if (!apiKey) {
      setShowApiKeyInput(true);
      return;
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await generateGeminiResponse(textToSend);
      
      const newBotMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: response,
        sender: "bot",
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to send message.");
      
      const errorMessage: Message = {
        id: Date.now().toString() + "-error",
        text: "Sorry, I encountered an error. Please try again later.",
        sender: "bot",
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full h-12 w-12 p-0 shadow-lg bg-primary hover:bg-primary/90"
        aria-label="Chat"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>

      <div
        className={`fixed bottom-20 right-4 w-80 sm:w-96 bg-card shadow-xl rounded-lg overflow-hidden border transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b bg-primary/5">
          <h3 className="font-semibold">Gemini AI Assistant</h3>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 rounded-full"
            onClick={() => setIsOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>

        {showApiKeyInput ? (
          <div className="p-4 space-y-4">
            <p className="text-sm">To use the Gemini AI chatbot, please enter your API key:</p>
            <div className="space-y-2">
              <input 
                type="password"
                value={apiKey || ''}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter your Gemini API key"
              />
              <Button 
                onClick={() => apiKey && handleSaveApiKey(apiKey)}
                disabled={!apiKey}
                className="w-full"
              >
                Save API Key
              </Button>
              <p className="text-xs text-muted-foreground">
                You can get your API key from <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
              </p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="h-80 p-4" ref={scrollAreaRef}>
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && <LoadingIndicator />}
              </div>
            </ScrollArea>

            <ChatInput
              message={message}
              setMessage={setMessage}
              onSubmit={() => handleSendMessage()}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
