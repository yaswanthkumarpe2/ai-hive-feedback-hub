
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatBotIconProps {
  isOpen: boolean;
  toggleChat: () => void;
  unreadMessages: number;
}

const ChatBotIcon = ({ isOpen, toggleChat, unreadMessages }: ChatBotIconProps) => {
  return (
    <Button
      onClick={toggleChat}
      className={cn(
        "fixed bottom-6 right-6 rounded-full p-3 shadow-lg transition-all duration-200 z-50",
        isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
      )}
      size="icon"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <div className="relative">
          <MessageCircle className="h-6 w-6" />
          {unreadMessages > 0 && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
              {unreadMessages}
            </div>
          )}
        </div>
      )}
    </Button>
  );
};

export default ChatBotIcon;
