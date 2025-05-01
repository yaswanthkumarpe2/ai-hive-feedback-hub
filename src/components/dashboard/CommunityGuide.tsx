
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommunityGuide = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Guide</CardTitle>
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
  );
};

export default CommunityGuide;
