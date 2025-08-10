"use client";

import React from "react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { CreditCard } from "@/components/ui/credit-card";
import { LineChart } from "@/components/charts/line-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DollarSign,
  CreditCard as CreditCardIcon,
  TrendingUp,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const transactions = [
  {
    id: 1,
    name: "From Pierre DC",
    type: "Bank transfer",
    amount: -1024,
    status: "completed",
    icon: ArrowDownLeft,
  },
  {
    id: 2,
    name: "From Alessandro VN",
    type: "Bank transfer",
    amount: +954,
    status: "completed",
    icon: ArrowUpRight,
  },
  {
    id: 3,
    name: "From Alex VVW",
    type: "Bank transfer",
    amount: -2024,
    status: "completed",
    icon: ArrowDownLeft,
  },
  {
    id: 4,
    name: "From Tiago DMF",
    type: "Bank transfer",
    amount: -928,
    status: "completed",
    icon: ArrowDownLeft,
  },
];

const investments = [
  {
    name: "TechFlow Inc",
    symbol: "TFLO",
    price: 116.33,
    change: 1024.0,
    changePercent: "+23.1%",
  },
  {
    name: "DataVerse Corp",
    symbol: "DVCR",
    price: 228.92,
    change: 495.0,
    changePercent: "+18.5%",
  },
  {
    name: "CloudNine Systems",
    symbol: "CNIN",
    price: 561.12,
    change: -2025.35,
    changePercent: "-12.3%",
  },
];

const contacts = [
  {
    name: "Sarah M",
    image:
      "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Mike R",
    image:
      "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "Anna K",
    image:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
  {
    name: "John D",
    image:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
  },
];

export default function Dashboard() {
  const {name} = useAuth()
  return (
    <div className="p-4 lg:p-6 space-y-6 lg:ml-64">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 lg:p-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Good afternoon, {name}! 👋
            </h1>
            <p className="text-gray-600">
              Welcome back to your financial dashboard
            </p>
          </div>
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <Button variant="outline" size="sm">
              This Month
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              Quick Transfer
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credit Card and Account Balance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CreditCard
                type="visa"
                number="3455 4562 7710 3507"
                holder="Alexander Munoz"
                expires="02/30"
                balance="$34,938 EUR"
                status="active"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl p-6 flex flex-col justify-center"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Personal account
                </h3>
                <Button size="sm" variant="outline">
                  + Add card
                </Button>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-4">
                86,113.75 <span className="text-sm font-normal">EUR</span>
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <button className="flex flex-col items-center text-gray-600">
                    <ArrowUp className="w-4 h-4 mb-1" />
                    Send
                  </button>
                  <button className="flex flex-col items-center text-gray-600">
                    <ArrowDown className="w-4 h-4 mb-1" />
                    Receive
                  </button>
                  <button className="flex flex-col items-center text-gray-600">
                    <CreditCardIcon className="w-4 h-4 mb-1" />
                    Copy
                  </button>
                  <button className="flex flex-col items-center text-gray-600">
                    <Shield className="w-4 h-4 mb-1" />
                    Block
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Transactions and Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg">Transactions</CardTitle>
                  <Button variant="link" size="sm" className="text-orange-600">
                    Show more
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">Today</p>
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <transaction.icon className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-medium ${
                            transaction.amount > 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.amount > 0 ? "+" : ""}
                          {transaction.amount}.00 EUR
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Statistics Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-lg">Your Statistics</CardTitle>
                  <Button variant="outline" size="sm">
                    This week
                  </Button>
                </CardHeader>
                <CardContent>
                  <LineChart />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Smart Invest */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Smart Invest</CardTitle>
                <Button variant="link" size="sm" className="text-orange-600">
                  Show more
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Popular
                  </Button>
                  <Button variant="outline" size="sm">
                    Tech
                  </Button>
                  <Button variant="outline" size="sm">
                    Social Media
                  </Button>
                  <Button variant="outline" size="sm">
                    Crypto
                  </Button>
                </div>
                {investments.map((investment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {investment.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {investment.symbol}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${investment.price}
                      </p>
                      <p
                        className={`text-sm ${
                          investment.change > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {investment.changePercent}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Fast Transfer */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Fast transfer</CardTitle>
                <Button variant="link" size="sm" className="text-orange-600">
                  + Add people
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Search className="w-4 h-4 text-gray-400" />
                  <div className="flex -space-x-2">
                    {contacts.map((contact, index) => (
                      <Avatar
                        key={index}
                        className="w-10 h-10 border-2 border-white"
                      >
                        <AvatarImage src={contact.image} alt={contact.name} />
                        <AvatarFallback>
                          {contact.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">From</span>
                    <span className="font-medium">Mastercard •••• 1827</span>
                    <span className="font-bold">$34,938</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">To</span>
                    <span className="font-medium">5854 3948 3934 1039</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">$3,736 CVV</span>
                    <Button variant="ghost" size="sm">
                      •••
                    </Button>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 mt-4">
                    Transfer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
