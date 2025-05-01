
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-aihive-purple to-aihive-blue p-8 text-white">
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10">
        <h2 className="text-2xl font-bold mb-2">Welcome to the COMMUNITY FEEDBACK COLLECTOR</h2>
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
  );
};

export default HeroSection;
