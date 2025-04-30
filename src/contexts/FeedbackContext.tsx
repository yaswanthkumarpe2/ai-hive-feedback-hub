
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

interface Feedback {
  id: string;
  userId: string;
  username: string;
  subject: string;
  message: string;
  rating: number;
  timestamp: number;
}

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (subject: string, message: string, rating: number) => void;
  getUserFeedbacks: () => Feedback[];
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

const FEEDBACKS_KEY = "aihive_feedbacks";

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  useEffect(() => {
    const savedFeedbacks = localStorage.getItem(FEEDBACKS_KEY);
    if (savedFeedbacks) {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }
  }, []);

  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem(FEEDBACKS_KEY, JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const addFeedback = (subject: string, message: string, rating: number) => {
    if (!user) return;

    const newFeedback: Feedback = {
      id: `feedback-${Date.now()}`,
      userId: user.id,
      username: user.username,
      subject,
      message,
      rating,
      timestamp: Date.now(),
    };

    setFeedbacks((prev) => [...prev, newFeedback]);
  };

  const getUserFeedbacks = () => {
    if (!user) return [];
    return feedbacks.filter((f) => f.userId === user.id);
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedbacks,
        addFeedback,
        getUserFeedbacks,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error("useFeedback must be used within a FeedbackProvider");
  }
  return context;
};
