
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { Brain, ChevronRight, GraduationCap, Layers, MessageSquare, MessagesSquare, Send, Users } from "lucide-react";
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

  // AI Topics for the community to discuss
  const aiTopics = [
    {
      title: "Generative AI Ethics",
      description: "Discuss the ethical implications of generative AI models and their impact on society",
      icon: Brain,
      color: "text-purple-500",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "AI Prompt Engineering",
      description: "Share techniques for crafting effective prompts for AI systems like GPT-4",
      icon: Layers,
      color: "text-blue-500",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Machine Learning Basics",
      description: "Learn about the fundamentals of machine learning algorithms and applications",
      icon: GraduationCap,
      color: "text-pink-500",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
    }
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
        
        {/* Hero Section with AI-themed gradient background */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-aihive-purple to-aihive-blue p-8 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome to the AI Hive Community</h2>
            <p className="text-white/80 max-w-xl">
              Connect with AI enthusiasts, share your experiences, and provide valuable feedback 
              to help shape the future of artificial intelligence technologies.
            </p>
            <div className="mt-4">
              <Link to="/discussion" className="inline-flex items-center text-sm font-medium text-white hover:underline">
                Join the discussion <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mb-20"></div>
          <div className="absolute top-0 right-32 w-20 h-20 bg-white/5 rounded-full"></div>
        </div>
        
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
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          
          <Card>
            <CardHeader>
              <CardTitle>AI Hive Guide</CardTitle>
              <CardDescription>How to participate effectively</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <span className="text-purple-500">1</span>
                    </div>
                    <p className="font-medium">Be respectful</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Treat other members with respect and courtesy in all interactions.
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <span className="text-blue-500">2</span>
                    </div>
                    <p className="font-medium">Share knowledge</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Contribute insights and experiences with the AI community.
                  </p>
                </div>
                
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center">
                      <span className="text-pink-500">3</span>
                    </div>
                    <p className="font-medium">Be constructive</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Provide helpful feedback that can lead to meaningful improvements.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Discussion Topics Section */}
        <div className="pt-4">
          <h2 className="text-2xl font-bold tracking-tight mb-4">Popular AI Topics</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {aiTopics.map((topic) => (
              <Card key={topic.title} className="group transition-all hover:shadow-md overflow-hidden">
                <CardHeader className={`border-b`}>
                  <div className="flex items-center gap-3">
                    <div className={`${topic.bgColor} p-2 rounded-md`}>
                      <topic.icon className={`h-5 w-5 ${topic.color}`} />
                    </div>
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-muted-foreground">{topic.description}</p>
                  <div className="mt-4 text-right">
                    <Link 
                      to="/discussion" 
                      className="text-sm font-medium text-primary inline-flex items-center group-hover:underline"
                    >
                      Join conversation <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
