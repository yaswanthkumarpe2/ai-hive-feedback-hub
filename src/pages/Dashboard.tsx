
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { MessageSquare, MessagesSquare, Send, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { groupMessages, directMessages } = useMessages();
  const { feedbacks } = useFeedback();
  
  // Get all users from localStorage
  const usersJson = localStorage.getItem("aihive_users");
  const users = usersJson ? JSON.parse(usersJson) : [];
  const userCount = users.length;
  
  // Calculate unread messages (in a real app, this would track read status)
  const directMessagesReceived = directMessages.filter(
    (msg) => msg.receiverId === user?.id
  );
  
  const stats = [
    {
      title: "Community Members",
      value: userCount,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Group Discussions",
      value: groupMessages.length,
      icon: MessagesSquare,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      link: "/discussion"
    },
    {
      title: "Direct Messages",
      value: directMessagesReceived.length,
      icon: MessageSquare,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      link: "/messages"
    },
    {
      title: "Feedback Submitted",
      value: feedbacks.filter(f => f.userId === user?.id).length,
      icon: Send,
      color: "text-green-500",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      link: "/feedback"
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to AI Hive, your AI community feedback platform
          </p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden">
              <Link to={stat.link || "#"} className="block h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.bgColor} p-2 rounded-md`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Community Discussions</CardTitle>
              <CardDescription>The latest topics being discussed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groupMessages.slice(-3).map((msg) => (
                  <div key={msg.id} className="flex flex-col space-y-1 rounded-lg border p-3">
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
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    No discussions yet. Start a conversation in the Discussion area.
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
          
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>How to participate effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p className="font-medium">Be respectful</p>
                <p className="text-muted-foreground">
                  Treat other members with respect and courtesy.
                </p>
                
                <p className="font-medium">Stay on topic</p>
                <p className="text-muted-foreground">
                  Keep discussions relevant to AI technology and innovation.
                </p>
                
                <p className="font-medium">Share knowledge</p>
                <p className="text-muted-foreground">
                  Contribute your insights and experiences with the community.
                </p>
                
                <p className="font-medium">Be constructive</p>
                <p className="text-muted-foreground">
                  Provide helpful feedback that can lead to improvements.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
