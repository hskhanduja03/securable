"use client";
import "../../globals.css";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Target,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Chrome,
  Apple,
  Github,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SignInPage() {
  const { signin, accessToken } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const router = useRouter();
  useEffect(() => {
    const checkToken = async () => {
      const token = accessToken || localStorage.getItem("accessToken");

      if (!token) return;

      try {
        const res = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          router.replace("/dashboard");
        }
      } catch (err) {
        console.error("Token verification failed:", err);
      }
    };

    checkToken();
  }, [accessToken, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Sign-in failed");

      signin(data.accessToken, data.email, data.name, data.userId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mb-4"
          >
            <Target className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your financial dashboard
          </p>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">
              Sign in to your account
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Social Login Buttons */}

            <div className="relative flex items-center justify-center">
              {/* Center line */}
              <div className="absolute inset-0 flex items-center">
                <Separator className="bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Text container */}
              <div className="relative flex flex-wrap items-center justify-center gap-2 px-3 bg-white dark:bg-gray-900 text-xs sm:text-sm rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Temporary User
                </span>
                <span className="text-gray-500 dark:text-gray-400 font-mono">
                  email: h@h.com | password: Hsk12345#
                </span>
              </div>
            </div>

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        rememberMe: checked as boolean,
                      }))
                    }
                  />
                  <Label
                    htmlFor="rememberMe"
                    className="text-sm text-gray-600 dark:text-gray-400"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-orange-600 hover:text-orange-500 font-medium"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/signup"
                  className="text-orange-600 hover:text-orange-500 font-medium"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-orange-600 hover:text-orange-500"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-orange-600 hover:text-orange-500"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
