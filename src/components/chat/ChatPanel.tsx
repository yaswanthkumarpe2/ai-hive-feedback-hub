
import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage, { MessageType } from "./ChatMessage";
import { nanoid } from "nanoid";

interface ChatPanelProps {
  isOpen: boolean;
  onNewMessage: () => void;
}

const generateBotResponse = async (message: string): Promise<string> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 600));
  
  // Sample responses
  const responses = [
    `Thanks for your message! Based on your query about "${message}", I can provide some information about community feedback. Is there something specific about AI technologies that you'd like to discuss?`,
    `That's an interesting question about "${message}". Community feedback is crucial for improving AI systems. Would you like to know more about specific areas where feedback has made a difference?`,
    `I understand you're interested in "${message}". The Community Feedback Collector helps gather insights from users like you to enhance AI systems and ensure they meet community needs.`,
    `Your interest in "${message}" is noted. From our community feedback data, this is a topic many users have opinions about. Would you like to contribute your specific thoughts on this area?`,
  ];
  
  // Return a random response
  return responses[Math.floor(Math.random() * responses.length)];
};

const ChatPanel = ({ isOpen, onNewMessage }: ChatPanelProps) => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      id: nanoid(),
      content: "Hello! I'm your Community Feedback Assistant. How can I help you today?",
      sender: "bot",
      timestamp: Date.now(),
    },
  ]);
  
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!inputValue.trim() || isSubmitting) return;
    
    const userMessage: MessageType = {
      id: nanoid(),
      content: inputValue.trim(),
      sender: "user",
      timestamp: Date.now(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSubmitting(true);
    
    try {
      // Get bot response
      const botResponse = await generateBotResponse(userMessage.content);
      
      const botMessage: MessageType = {
        id: nanoid(),
        content: botResponse,
        sender: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
      onNewMessage();
    } catch (error) {
      console.error("Error generating response:", error);
      
      const errorMessage: MessageType = {
        id: nanoid(),
        content: "Sorry, I'm having trouble responding right now. Please try again later.",
        sender: "bot",
        timestamp: Date.now(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className={`fixed bottom-20 right-6 z-40 flex w-80 flex-col rounded-lg border bg-card shadow-xl transition-all duration-300 sm:w-96 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0 translate-y-4"
      }`}
      style={{ height: "500px", maxHeight: "calc(100vh - 150px)" }}
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
            <span className="text-xs font-bold text-primary-foreground">CFC</span>
          </div>
          <div>
            <h3 className="text-sm font-medium">COMMUNITY FEEDBACK COLLECTOR</h3>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-1 py-4">
        <div className="flex flex-col gap-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isSubmitting && (
            <div className="flex gap-2 px-4">
              <div className="h-8 w-8 flex-shrink-0" />
              <div className="flex gap-1 rounded-lg bg-muted px-4 py-2">
                <span className="animate-bounce">•</span>
                <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>
                  •
                </span>
                <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>
                  •
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
        className="flex items-end gap-2 border-t p-3"
      >
        <Textarea
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="min-h-10 max-h-32 resize-none"
          disabled={isSubmitting}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!inputValue.trim() || isSubmitting}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;
