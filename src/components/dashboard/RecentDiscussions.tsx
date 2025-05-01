
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMessages } from "@/contexts/MessageContext";
import { MessagesSquare } from "lucide-react";

const RecentDiscussions = () => {
  const { groupMessages } = useMessages();

  return (
    <Card className="col-span-2 overflow-hidden">
      <CardHeader>
        <CardTitle>Recent Community Discussions</CardTitle>
        <CardDescription>The latest topics being discussed</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {groupMessages.slice(-3).map((msg) => (
            <div key={msg.id} className="flex flex-col space-y-1 rounded-lg border p-3 transition-colors hover:bg-muted/30">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary-foreground">
                    {msg.senderName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium leading-none">{msg.senderName}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(msg.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          {groupMessages.length === 0 && (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                <MessagesSquare className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No discussions yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Start a conversation in the Discussion area.</p>
              <Link 
                to="/discussion"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Start a Discussion
              </Link>
            </div>
          )}
        </div>
        {groupMessages.length > 0 && (
          <div className="mt-4 text-center">
            <Link 
              to="/discussion"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all discussions
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentDiscussions;
