
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { MessageSquare, MessagesSquare, Send, Users } from "lucide-react";

const StatsCards = () => {
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
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="overflow-hidden transition-all hover:shadow-md">
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
  );
};

export default StatsCards;
