
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, ChevronRight, GraduationCap, Layers } from "lucide-react";

const AiTopics = () => {
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
  );
};

export default AiTopics;
