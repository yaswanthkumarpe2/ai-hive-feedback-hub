
import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Discussion = () => {
  const { user } = useAuth();
  const { groupMessages, sendGroupMessage } = useMessages();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [groupMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSubmitting(true);
    try {
      sendGroupMessage(message);
      setMessage("");
      
      toast({
        title: "Message sent",
        description: "Your message has been sent to the discussion",
      });
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-10rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight">Community Discussion</h1>
          <p className="text-muted-foreground">
            Chat with other AI enthusiasts in real-time
          </p>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          <Card className="flex-1 overflow-y-auto mb-4">
            <CardContent className="p-4 space-y-4">
              {groupMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm text-muted-foreground">
                      Be the first to start a conversation!
                    </p>
                  </div>
                </div>
              ) : (
                groupMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${
                      msg.senderId === user?.id ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.senderId === user?.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {msg.senderId !== user?.id && (
                        <div className="flex items-center gap-2 mb-1">
                          <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-xs font-semibold text-secondary-foreground">
                              {msg.senderName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs font-medium">{msg.senderName}</p>
                        </div>
                      )}
                      <p>{msg.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>

          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[80px]"
              required
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-auto"
              disabled={isSubmitting}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default Discussion;
