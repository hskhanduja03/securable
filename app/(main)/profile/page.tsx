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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const dummyTransactions = [
  {
    id: 1,
    description: "Salary",
    amount: 3000,
    type: "income",
    category: "Income",
    date: "2025-08-05",
  },
  {
    id: 2,
    description: "Grocery Store",
    amount: 200,
    type: "expense",
    category: "Food",
    date: "2025-08-06",
  },
  {
    id: 3,
    description: "Electricity Bill",
    amount: 100,
    type: "expense",
    category: "Utilities",
    date: "2025-08-07",
  },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "finance" | "settings" | "privacy"
  >("profile");

  // Fake state for toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col max-w-6xl mx-auto p-6 sm:p-12 rounded-lg shadow-lg">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10">
        <Avatar className="h-28 w-28 sm:h-32 sm:w-32 shadow-lg">
          <AvatarImage
            src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400"
            alt="John Carter"
          />
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-center sm:text-left flex-1">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white leading-tight flex items-center gap-3">
            John Carter{" "}
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-600 rounded-full font-semibold">
              Premium
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1 text-lg sm:text-xl font-medium tracking-wide">
            john.carter@example.com
          </p>
          <p className="mt-3 max-w-lg text-gray-700 dark:text-gray-400 text-base sm:text-lg">
            Manage your profile, finances, budgets, and privacy settings all in
            one place.
          </p>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex border-b border-gray-300 dark:border-gray-700 mb-8 justify-center sm:justify-start space-x-6 overflow-x-auto">
        {[
          {
            id: "profile",
            label: "Profile",
            icon: <User className="w-5 h-5" />,
          },
          {
            id: "finance",
            label: "Finance",
            icon: <PieChart className="w-5 h-5" />,
          },
          {
            id: "settings",
            label: "Settings",
            icon: <Settings className="w-5 h-5" />,
          },
          {
            id: "privacy",
            label: "Privacy",
            icon: <Lock className="w-5 h-5" />,
          },
        ].map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 py-3 px-6 font-semibold text-sm sm:text-base border-b-4 -mb-[1px] transition-colors whitespace-nowrap ${
              activeTab === id
                ? "border-orange-500 text-orange-600 dark:text-orange-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
            aria-current={activeTab === id ? "page" : undefined}
          >
            {icon}
            {label}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <main className="flex-1 max-w-5xl mx-auto space-y-10">
        {/* PROFILE */}
        {activeTab === "profile" && (
          <section className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h2>
            <form className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Full Name
                  </span>
                  <input
                    type="text"
                    defaultValue="John Carter"
                    className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </label>

                <label className="flex flex-col">
                  <span className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Email Address
                  </span>
                  <input
                    type="email"
                    defaultValue="john.carter@example.com"
                    className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
                  />
                </label>

                <label className="flex flex-col sm:col-span-2">
                  <span className="text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Bio
                  </span>
                  <textarea
                    rows={3}
                    defaultValue="Personal finance enthusiast, saver, and investor."
                    className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
                  />
                </label>
              </div>

              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
              >
                Save Changes
              </Button>
            </form>
          </section>
        )}

        {/* FINANCE */}
        {activeTab === "finance" && (
          <section className="space-y-8 max-w-5xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Financial Overview
            </h2>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-10">
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
                <DollarSign className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Total Balance
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  $5,200
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
                <ArrowUpCircle className="w-8 h-8 text-green-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Income
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  $3,500
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
                <ArrowDownCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Expenses
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  $2,100
                </p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 flex flex-col items-center">
                <CheckCircle className="w-8 h-8 text-orange-500 mb-2" />
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Savings Goals
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  75% achieved
                </p>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6 max-w-4xl mx-auto">
              <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
                Recent Transactions
              </h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {dummyTransactions.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex justify-between items-center py-3"
                    title={`${tx.description} - ${tx.category}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          tx.type === "income"
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpCircle className="w-6 h-6" />
                        ) : (
                          <ArrowDownCircle className="w-6 h-6" />
                        )}
                      </span>
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">
                          {tx.description}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          {tx.category} &bull; {tx.date}
                        </p>
                      </div>
                    </div>
                    <p
                      className={`font-semibold ${
                        tx.type === "income"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}${tx.amount}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* SETTINGS */}
        {activeTab === "settings" && (
          <section className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              App Settings
            </h2>

            <div className="space-y-6">
              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6 text-orange-500"
                  checked={notificationsEnabled}
                  onChange={() =>
                    setNotificationsEnabled(!notificationsEnabled)
                  }
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Enable notifications
                </span>
              </label>

              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6 text-orange-500"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Dark mode
                </span>
              </label>

              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6 text-orange-500"
                  defaultChecked
                  disabled
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Auto-sync transactions (enabled)
                </span>
              </label>

              <hr className="border-gray-300 dark:border-gray-700 my-6" />

              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Linked Bank Accounts
                </h3>
                <ul className="space-y-4">
                  <li className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Bank of America - ****1234
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last synced 2 days ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unlink
                    </Button>
                  </li>
                  <li className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-md p-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Chase Bank - ****5678
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Last synced 1 week ago
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Unlink
                    </Button>
                  </li>
                </ul>
                <Button className="mt-4" size="sm" variant="default">
                  Link New Account
                </Button>
              </div>

              <hr className="border-gray-300 dark:border-gray-700 my-6" />

              <div className="flex space-x-4 justify-center sm:justify-start">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export Data
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Import Data
                </Button>
              </div>
            </div>
          </section>
        )}

        {/* PRIVACY */}
        {activeTab === "privacy" && (
          <section className="space-y-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Privacy & Security
            </h2>
            <div className="space-y-6">
              <label className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox h-6 w-6 text-orange-500"
                  checked={twoFactorEnabled}
                  onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  Two-Factor Authentication
                </span>
              </label>

              <Button
                variant="destructive"
                className="w-full sm:w-auto mt-6"
                onClick={() => alert("Signed out")}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Sign Out
              </Button>
            </div>
          </section>
        )}
      </main>

      {/* Footer Image */}
      <footer className="mt-20 flex justify-center opacity-30 dark:opacity-20 pointer-events-none">
        <img
          src="/finance-footer-abstract.svg"
          alt="Finance abstract footer"
          className="w-72 sm:w-96"
          loading="lazy"
        />
      </footer>
    </div>
  );
}
