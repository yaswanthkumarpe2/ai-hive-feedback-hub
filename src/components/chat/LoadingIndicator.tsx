
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start px-2">
      <div className="flex items-center space-x-1 bg-muted rounded-lg px-3 py-2">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingIndicator;
