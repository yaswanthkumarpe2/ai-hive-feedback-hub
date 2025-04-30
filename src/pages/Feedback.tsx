
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useFeedback } from "@/contexts/FeedbackContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
  const { user } = useAuth();
  const { addFeedback, getUserFeedbacks, feedbacks } = useFeedback();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      addFeedback(subject, message, rating);
      
      // Reset form
      setSubject("");
      setMessage("");
      setRating(5);
      
      toast({
        title: "Feedback submitted",
        description: "Thank you for your feedback!",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const userFeedbacks = getUserFeedbacks();
  const isAdmin = user?.isAdmin || false;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Feedback</h1>
          <p className="text-muted-foreground">
            Share your thoughts and suggestions about AI Hive
          </p>
        </div>

        <Tabs defaultValue="submit">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="submit">Submit Feedback</TabsTrigger>
            <TabsTrigger value="history">My Submissions</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">All Feedback</TabsTrigger>}
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Feedback</CardTitle>
                <CardDescription>
                  Help us improve AI Hive by sharing your experience
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter a subject for your feedback"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Provide details about your feedback"
                      className="min-h-[150px]"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="rating"
                        type="range"
                        min="1"
                        max="5"
                        step="1"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span>{rating}/5</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userFeedbacks.length > 0 ? (
                userFeedbacks.map((feedback) => (
                  <Card key={feedback.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{feedback.subject}</CardTitle>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < feedback.rating 
                                ? "text-yellow-400 fill-yellow-400" 
                                : "text-gray-300"
                            }`} 
                          />
                        ))}
                      </div>
                      <CardDescription>
                        {new Date(feedback.timestamp).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{feedback.message}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="md:col-span-2 lg:col-span-3">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">
                      You haven't submitted any feedback yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All User Feedback</CardTitle>
                    <CardDescription>
                      View and manage feedback from all users
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {feedbacks.length > 0 ? (
                      <div className="space-y-4">
                        {feedbacks.map((feedback) => (
                          <Card key={feedback.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">
                                    {feedback.subject}
                                  </CardTitle>
                                  <CardDescription>
                                    From: {feedback.username} ({new Date(feedback.timestamp).toLocaleDateString()})
                                  </CardDescription>
                                </div>
                                <div className="flex items-center">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon 
                                      key={i} 
                                      className={`h-4 w-4 ${
                                        i < feedback.rating 
                                          ? "text-yellow-400 fill-yellow-400" 
                                          : "text-gray-300"
                                      }`} 
                                    />
                                  ))}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p>{feedback.message}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">
                          No feedback submissions yet.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default Feedback;
