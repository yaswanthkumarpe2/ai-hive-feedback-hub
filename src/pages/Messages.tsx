
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages } from "@/contexts/MessageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, User } from "lucide-react";

const Messages = () => {
  const { user } = useAuth();
  const { directMessages, sendDirectMessage, getDirectMessagesForUser } = useMessages();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load all users
  useEffect(() => {
    const usersJson = localStorage.getItem("aihive_users");
    if (usersJson) {
      const users = JSON.parse(usersJson).filter((u: any) => u.id !== user?.id);
      setAllUsers(users);
      setFilteredUsers(users);
    }
  }, [user?.id]);

  // Filter users based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  // Get all users that the current user has messaged with
  const getUsersWithMessages = () => {
    const userIds = new Set<string>();
    
    directMessages.forEach(msg => {
      if (msg.senderId === user?.id) {
        userIds.add(msg.receiverId!);
      } else if (msg.receiverId === user?.id) {
        userIds.add(msg.senderId);
      }
    });
    
    return allUsers.filter(u => userIds.has(u.id));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser || !message.trim()) return;
    
    sendDirectMessage(selectedUser.id, message);
    setMessage("");
  };

  const userWithMessages = getUsersWithMessages();
  const selectedUserMessages = selectedUser 
    ? getDirectMessagesForUser(selectedUser.id) 
    : [];
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">
            Private conversations with community members
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="all">All Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recent">
                <Card>
                  <CardHeader className="pb-2">
                    <Input
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                  </CardHeader>
                  <CardContent>
                    {userWithMessages.length > 0 ? (
                      <div className="space-y-2">
                        {userWithMessages.map((user) => (
                          <Button
                            key={user.id}
                            variant={selectedUser?.id === user.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setSelectedUser(user)}
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                                <span className="text-xs font-semibold text-primary-foreground">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{user.username}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                        <p className="mt-2 text-muted-foreground">
                          No conversations yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start a message with someone from the All Users tab
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="all">
                <Card>
                  <CardHeader className="pb-2">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="mb-2"
                    />
                  </CardHeader>
                  <CardContent>
                    {filteredUsers.length > 0 ? (
                      <div className="space-y-2">
                        {filteredUsers.map((user) => (
                          <Button
                            key={user.id}
                            variant={selectedUser?.id === user.id ? "secondary" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => setSelectedUser(user)}
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                                <span className="text-xs font-semibold text-primary-foreground">
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium">{user.username}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-muted-foreground">No users found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="lg:col-span-2">
            <Card className="h-[calc(80vh-10rem)]">
              {selectedUser ? (
                <div className="flex flex-col h-full">
                  <CardHeader className="border-b pb-3">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center mr-2">
                        <span className="text-xs font-semibold text-primary-foreground">
                          {selectedUser.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{selectedUser.username}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedUser.email}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedUserMessages.length > 0 ? (
                      selectedUserMessages.map((msg) => (
                        <div 
                          key={msg.id} 
                          className={`flex ${
                            msg.senderId === user?.id ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div 
                            className={`max-w-[70%] rounded-lg p-3 ${
                              msg.senderId === user?.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <p className="text-lg font-medium">No messages yet</p>
                          <p className="text-sm text-muted-foreground">
                            Start a conversation with {selectedUser.username}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <div className="p-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={`Message ${selectedUser.username}...`}
                        className="min-h-[60px] resize-none"
                        required
                      />
                      <Button type="submit" size="icon" className="h-auto">
                        <Send className="h-5 w-5" />
                      </Button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <User className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm text-muted-foreground">
                      Choose a user to start messaging
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;
