"use client";

import React, { useState } from "react";
import {
  User,
  Settings,
  Lock,
  LogOut,
  CreditCard,
  Download,
  Upload,
  PieChart,
  DollarSign,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle,
  Bell,
  Moon,
  Sun,
  Smartphone,
  Shield,
  Eye,
  EyeOff,
  Camera,
  Edit3,
  Trash2,
  Plus,
  Wallet,
  Building2,
  TrendingUp,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const dummyTransactions = [
  {
    id: 1,
    description: "Monthly Salary",
    amount: 3000,
    type: "income",
    category: "Salary",
    date: "2025-08-05",
    paymentMethod: "Direct Deposit",
  },
  {
    id: 2,
    description: "Whole Foods Market",
    amount: 200,
    type: "expense",
    category: "Food & Dining",
    date: "2025-08-06",
    paymentMethod: "Visa ••••1234",
  },
  {
    id: 3,
    description: "Electric Company",
    amount: 100,
    type: "expense",
    category: "Utilities",
    date: "2025-08-07",
    paymentMethod: "Auto Pay",
  },
  {
    id: 4,
    description: "Freelance Project",
    amount: 800,
    type: "income",
    category: "Freelance",
    date: "2025-08-04",
    paymentMethod: "PayPal",
  },
  {
    id: 5,
    description: "Netflix Subscription",
    amount: 15,
    type: "expense",
    category: "Entertainment",
    date: "2025-08-03",
    paymentMethod: "Mastercard ••••5678",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: "John Carter",
    email: "john.carter@example.com",
    bio: "Personal finance enthusiast, saver, and investor.",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
  });

  const [linkedAccounts] = useState([
    {
      id: 1,
      name: "Bank of America",
      type: "Checking",
      number: "••••1234",
      balance: "$3,250.00",
      lastSync: "2 hours ago",
      status: "active",
    },
    {
      id: 2,
      name: "Chase Savings",
      type: "Savings",
      number: "••••5678",
      balance: "$12,800.00",
      lastSync: "1 day ago",
      status: "active",
    },
    {
      id: 3,
      name: "Capital One Credit",
      type: "Credit Card",
      number: "••••9012",
      balance: "-$1,250.00",
      lastSync: "3 hours ago",
      status: "active",
    },
  ]);

  const handleInputChange = (field:any, value:any) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Simulate API call
    console.log("Saving profile:", profileData);
    // Show success message
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { id: "finance", label: "Finance", icon: <PieChart className="w-4 h-4" /> },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
    },
    { id: "privacy", label: "Privacy", icon: <Lock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 lg:ml-64">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="relative group">
              <Avatar className="h-24 w-24 shadow-lg ring-4 ring-white">
                <AvatarImage
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="John Carter"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold">
                  JC
                </AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-1 -right-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                <Camera className="w-3 h-3" />
              </button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData.fullName}
                </h1>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border border-orange-200">
                  Premium
                </span>
              </div>
              <p className="text-gray-600 text-lg mb-2">{profileData.email}</p>
              <p className="text-gray-500 max-w-md">{profileData.bio}</p>

              <div className="flex flex-wrap gap-4 mt-6 justify-center sm:justify-start">
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 rounded-full px-3 py-1">
                  <Smartphone className="w-3 h-3" />
                  {profileData.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100/50 rounded-full px-3 py-1">
                  <Building2 className="w-3 h-3" />
                  {profileData.location}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-2 shadow-sm">
          <nav className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Personal Information
                    </h2>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSaveProfile();
                    }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Location
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                          className="w-full h-12 px-4 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-2 sm:col-span-2">
                        <label className="block text-sm font-semibold text-gray-800">
                          Bio
                        </label>
                        <textarea
                          rows={4}
                          value={profileData.bio}
                          onChange={(e) =>
                            handleInputChange("bio", e.target.value)
                          }
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-400 resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Finance Tab */}
            {activeTab === "finance" && (
              <div className="space-y-8">
                {/* Financial Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-green-100 rounded-xl">
                        <DollarSign className="w-6 h-6 text-green-600" />
                      </div>
                      <button onClick={() => setShowBalance(!showBalance)}>
                        {showBalance ? (
                          <Eye className="w-4 h-4 text-gray-400" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Total Balance
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {showBalance ? "$14,800" : "••••••"}
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      +8.2% from last month
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                    <div className="p-3 bg-blue-100 rounded-xl mb-4 w-fit">
                      <ArrowUpCircle className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Monthly Income
                    </p>
                    <p className="text-2xl font-bold text-gray-900">$3,800</p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" />
                      August 2025
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                    <div className="p-3 bg-red-100 rounded-xl mb-4 w-fit">
                      <ArrowDownCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Monthly Expenses
                    </p>
                    <p className="text-2xl font-bold text-gray-900">$2,315</p>
                    <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
                      <Filter className="w-3 h-3" />5 categories
                    </p>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
                    <div className="p-3 bg-purple-100 rounded-xl mb-4 w-fit">
                      <CheckCircle className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-600 mb-1">
                      Savings Goal
                    </p>
                    <p className="text-2xl font-bold text-gray-900">78%</p>
                    <p className="text-xs text-purple-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      $7,800 of $10,000
                    </p>
                  </div>
                </div>

                {/* Linked Accounts */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-xl">
                        <Wallet className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Linked Accounts
                      </h3>
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4 py-2 font-semibold text-sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Link Account
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {linkedAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {account.name} {account.type}
                            </p>
                            <p className="text-sm text-gray-500">
                              {account.number} • Last sync: {account.lastSync}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {account.balance}
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-500">
                              Active
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-xl">
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Recent Transactions
                      </h3>
                    </div>
                    <Button
                      variant="outline"
                      className="border-0 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl"
                    >
                      View All
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {dummyTransactions.slice(0, 5).map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors duration-200"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${
                              tx.type === "income"
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            {tx.type === "income" ? (
                              <ArrowUpCircle className="w-5 h-5" />
                            ) : (
                              <ArrowDownCircle className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {tx.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              {tx.category} • {tx.paymentMethod}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              tx.type === "income"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {tx.type === "income" ? "+" : "-"}${tx.amount}
                          </p>
                          <p className="text-sm text-gray-500">{tx.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-xl">
                      <Settings className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      App Preferences
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Bell className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive alerts for transactions and budgets
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationsEnabled}
                          onChange={() =>
                            setNotificationsEnabled(!notificationsEnabled)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          {darkMode ? (
                            <Moon className="w-4 h-4 text-purple-600" />
                          ) : (
                            <Sun className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Dark Mode
                          </p>
                          <p className="text-sm text-gray-500">
                            Switch to dark theme
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={darkMode}
                          onChange={() => setDarkMode(!darkMode)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Data Management
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="outline"
                          className="border-0 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export Data
                        </Button>
                        <Button
                          variant="outline"
                          className="border-0 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          Import Data
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <div className="space-y-6">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-100 rounded-xl">
                      <Lock className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Privacy & Security
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Two-Factor Authentication
                          </p>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={() =>
                            setTwoFactorEnabled(!twoFactorEnabled)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Smartphone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            Biometric Authentication
                          </p>
                          <p className="text-sm text-gray-500">
                            Use fingerprint or face recognition
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={biometricEnabled}
                          onChange={() =>
                            setBiometricEnabled(!biometricEnabled)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Account Actions
                      </h3>
                      <div className="space-y-3">
                        <Button
                          variant="outline"
                          className="border-0 bg-gray-100/80 hover:bg-gray-200/80 text-gray-700 rounded-xl flex items-center gap-2 w-full sm:w-auto"
                        >
                          <Edit3 className="w-4 h-4" />
                          Change Password
                        </Button>

                        <Button
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Are you sure you want to sign out?")) {
                              console.log("Signing out...");
                              // Handle sign out logic
                            }
                          }}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Management */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-yellow-100 rounded-xl">
                      <User className="w-5 h-5 text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Account Management
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50/50 rounded-xl border border-yellow-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Download Your Data
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Get a copy of all your financial data
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50 rounded-xl"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-red-50/50 rounded-xl border border-red-200/50">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Delete Account
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => {
                            if (
                              confirm(
                                "This action cannot be undone. Are you sure?"
                              )
                            ) {
                              console.log("Deleting account...");
                              // Handle account deletion
                            }
                          }}
                          className="border-red-300 text-red-700 hover:bg-red-50 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Quick Stats Footer */}
       
      </div>
    </div>
  );
}
