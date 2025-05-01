import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  avatarUrl?: string; // Added for ChatMessage component
  displayName?: string; // Added for ChatMessage component
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users storage
const USERS_STORAGE_KEY = "aihive_users";
const CURRENT_USER_KEY = "aihive_current_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize or get users from localStorage
  const initializeUsers = () => {
    const existingUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (!existingUsers) {
      // Create admin user by default
      const adminUser = {
        id: "admin-" + Date.now(),
        username: "admin",
        email: "admin@aihive.com",
        password: "admin123", // In a real app, this would be hashed
        isAdmin: true,
      };
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([adminUser]));
    }
  };

  useEffect(() => {
    initializeUsers();
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Ensure the user has the required properties
      if (!parsedUser.displayName) {
        parsedUser.displayName = parsedUser.username;
      }
      if (!parsedUser.avatarUrl) {
        parsedUser.avatarUrl = `https://ui-avatars.com/api/?name=${parsedUser.username}&background=random`;
      }
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersJson) {
        console.error("No users found");
        setLoading(false);
        return false;
      }
      
      const users = JSON.parse(usersJson);
      const foundUser = users.find(
        (u: any) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        // Remove password before storing in state
        const { password, ...userWithoutPassword } = foundUser;
        // Add displayName and avatarUrl if not present
        if (!userWithoutPassword.displayName) {
          userWithoutPassword.displayName = userWithoutPassword.username;
        }
        if (!userWithoutPassword.avatarUrl) {
          userWithoutPassword.avatarUrl = `https://ui-avatars.com/api/?name=${userWithoutPassword.username}&background=random`;
        }
        setUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
      return false;
    }
  };

  const signup = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email already exists
      if (users.some((u: any) => u.email === email)) {
        setLoading(false);
        return false;
      }
      
      const newUser = {
        id: "user-" + Date.now(),
        username,
        email,
        password, // In a real app, this would be hashed
        isAdmin: false,
        displayName: username,
        avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
      };
      
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      // Log in the new user
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    
    try {
      const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
      if (!usersJson) return;
      
      const users = JSON.parse(usersJson);
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return { ...u, ...data };
        }
        return u;
      });
      
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      
      // Update current user
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Update profile error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
