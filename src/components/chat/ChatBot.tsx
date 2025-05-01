
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
      text: "Hello! I'm your community feedback assistant. How can I help you today?",
      sender: "bot",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [feedbackData, setFeedbackData] = useState<any[]>([]);
  const [feedbackLoaded, setFeedbackLoaded] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (user && isOpen && !feedbackLoaded) {
      const loadFeedback = async () => {
        try {
          setFeedbackLoaded(true);
        } catch (error) {
          console.error("Error loading feedback data:", error);
        }
      };
      loadFeedback();
    }
  }, [user, isOpen, feedbackLoaded]);

  useEffect(() => {
    // when chat opens, automatically send "hi" once
    if (isOpen) {
      handleSendMessage("hi");
    }
  }, [isOpen]);

  const handleSendMessage = async (customMessage?: string) => {
    const textToSend = customMessage ?? message;

    if (!textToSend.trim()) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Simulate API call with mock response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const botResponses = [
        "Thanks for your feedback! How else can I assist you with the community feedback system?",
        "That's interesting! Could you tell me more about your experience with our platform?",
        "I understand your concerns. The community feedback process is designed to be transparent and effective.",
        "Great question! The community feedback collector helps gather insights to improve our AI systems.",
        "I've noted your feedback. Is there anything specific you'd like to know about how feedback is processed?",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const newBotMessage: Message = {
        id: Date.now().toString() + "-bot",
        text: randomResponse,
        sender: "bot",
      };

      setMessages((prev) => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error processing message:", error);
      toast.error("Failed to send message.");
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
          <h3 className="font-semibold">Community Assistant</h3>
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
      </div>
    </>
  );
};

export default ChatBot;
