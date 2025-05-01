
import MainLayout from "@/components/layout/MainLayout";
import ChatBot from "@/components/chat/ChatBot";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentDiscussions from "@/components/dashboard/RecentDiscussions";
import CommunityGuide from "@/components/dashboard/CommunityGuide";
import AiTopics from "@/components/dashboard/AiTopics";
import HeroSection from "@/components/dashboard/HeroSection";

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to COMMUNITY FEEDBACK COLLECTOR, your AI community feedback platform
          </p>
        </div>
        
        {/* Hero Section */}
        <HeroSection />
        
        {/* Stats Cards */}
        <StatsCards />
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Recent Discussions */}
          <RecentDiscussions />
          
          {/* Community Guide */}
          <CommunityGuide />
        </div>

        {/* AI Topics Section */}
        <AiTopics />

        {/* ChatBot (floating) */}
        <ChatBot />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
