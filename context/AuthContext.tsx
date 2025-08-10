"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPaymentGroups } from "@/lib/paymentUtils"; // Import the utility function

interface AuthContextType {
  accessToken: string | null;
  email: string | null;
  name: string | null;
  userId: string | null;
  paymentMethods: any[]; // Add payment methods to context
  signin: (
    token: string,
    userEmail: string,
    userName: string,
    userId: string
  ) => void;
  signout: () => void;
  addPaymentMethod: (newGroup: any) => void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  email: null,
  name: null,
  userId: null,
  paymentMethods: [], // Default to an empty array
  signin: () => {},
  signout: () => {},
  addPaymentMethod: (newGroup: any) => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken");
    }
    return null;
  });

  const [email, setEmail] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail");
    }
    return null;
  });

  const [name, setName] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userName");
    }
    return null;
  });

  const [userId, setUserId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null;
  });

  const [paymentMethods, setPaymentMethods] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const storedPaymentMethods = localStorage.getItem("paymentMethods");
      return storedPaymentMethods ? JSON.parse(storedPaymentMethods) : [];
    }
    return [];
  });

  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("accessToken");
      const userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");
      const userId = localStorage.getItem("userId");

      if (!token || !userEmail || !userName || !userId) {
        setAccessToken(null);
        setEmail(null);
        setName(null);
        setUserId(null);
        setPaymentMethods([]); // Clear payment methods on signout
        window.location.href = "/auth/signin";
      } else {
        setAccessToken(token);
        setEmail(userEmail);
        setName(userName);
        setUserId(userId);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [router]);

  const addPaymentMethod = (newGroup: any) => {
    setPaymentMethods((prevMethods) => [...prevMethods, newGroup]);

    // Optionally, update localStorage
    if (typeof window !== "undefined") {
      const updatedMethods = [...paymentMethods, newGroup];
      localStorage.setItem("paymentMethods", JSON.stringify(updatedMethods));
    }
  };
  // Fetch payment methods when the user signs in
  const fetchAndSetPaymentMethods = async (userId: string) => {
    try {
      const groups = await fetchPaymentGroups(userId);
      setPaymentMethods(groups); // Set the payment methods in the context
      // Persist payment methods to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("paymentMethods", JSON.stringify(groups));
      }
    } catch (error) {
      console.error("Failed to fetch payment methods", error);
    }
  };

  const signin = (
    token: string,
    userEmail: string,
    userName: string,
    userId: string
  ) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId); // Store userId in localStorage

    setAccessToken(token);
    setEmail(userEmail);
    setName(userName);
    setUserId(userId); // Update userId in context

    fetchAndSetPaymentMethods(userId); // Fetch and set payment methods

    router.push("/dashboard");
  };

  const signout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId"); // Remove userId from localStorage
    localStorage.removeItem("paymentMethods"); // Remove payment methods from localStorage

    setAccessToken(null);
    setEmail(null);
    setName(null);
    setUserId(null); // Clear userId in context
    setPaymentMethods([]); // Clear payment methods

    window.location.href = "/auth/signin";
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        email,
        name,
        userId,
        paymentMethods, // Provide payment methods in context
        signin,
        signout,
        addPaymentMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
