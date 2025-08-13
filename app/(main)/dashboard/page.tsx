"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  CreditCard as CreditCardIcon,
  TrendingUp,
  TrendingDown,
  Shield,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowUp,
  ArrowDown,
  Search,
  Plus,
  Zap,
  Wallet,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
  RefreshCw,
  Download,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { StatCard } from "@/components/ui/stat-card";
import { DoughnutChart } from "@/components/charts/doughnut-chart";
import { CreditCard } from "@/components/ui/credit-card";

// TypeScript interfaces
interface Transaction {
  _id: string;
  name: string;
  amount: number;
  type: "credit" | "debit";
  date: string;
  category?: string;
  paymentGroup?: {
    name: string;
  };
  paymentMethod?: {
    name: string;
  };
}

interface MonthlySpendingData {
  month: string;
  spending: number;
  income: number;
}

interface WeeklyActivityData {
  day: string;
  transactions: number;
  amount: number;
}

interface CategorySpendingData {
  name: string;
  value: number;
  color: string;
}

interface ProcessedData {
  monthlySpendingData: MonthlySpendingData[];
  weeklyActivityData: WeeklyActivityData[];
  categorySpendingData: CategorySpendingData[];
  stats: {
    totalIncome: number;
    totalExpenses: number;
  };
}

interface PaymentMethod {
  _id: string;
  name: string;
  active: boolean;
  details?: {
    company?: string;
    cardNumber?: string;
    cardHolderName?: string;
    expiryDate?: string;
  };
}

interface PaymentGroup {
  name: string;
  methods: PaymentMethod[];
}

interface CreditCardData {
  id: string;
  type: string;
  number: string;
  holder: string;
  expires: string;
  isActive: boolean;
  usage: boolean;
}

interface LoadingState {
  fetch: boolean;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ fetch: false });
  const [activeChart, setActiveChart] = useState<string>("spending");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentGroup[]>([]);
  const { userId, name } = useAuth();
  const router = useRouter();
  const [totalPaymentMethods, setTotalPaymentMethods] = useState<number>(0);

  // Data processing functions
  const processedData = useMemo((): ProcessedData => {
    if (!transactions.length)
      return {
        monthlySpendingData: [],
        weeklyActivityData: [],
        categorySpendingData: [],
        stats: { totalIncome: 0, totalExpenses: 0 },
      };

    // Process monthly spending data
    const monthlyData: Record<string, MonthlySpendingData & { date: Date }> =
      {};
    transactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthName,
          spending: 0,
          income: 0,
          date: date,
        };
      }

      if (transaction.type === "credit") {
        monthlyData[monthKey].income += Math.abs(transaction.amount);
      } else {
        monthlyData[monthKey].spending += Math.abs(transaction.amount);
      }
    });

    const monthlySpendingData: MonthlySpendingData[] = Object.values(
      monthlyData
    )
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-6) // Last 6 months
      .map(({ date, ...rest }) => rest);

    // Process weekly activity data
    const weeklyData: Record<
      string,
      WeeklyActivityData & { dayIndex: number }
    > = {};
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    transactions.forEach((transaction: Transaction) => {
      const date = new Date(transaction.date);
      const dayName = dayNames[date.getDay()];

      if (!weeklyData[dayName]) {
        weeklyData[dayName] = {
          day: dayName,
          transactions: 0,
          amount: 0,
          dayIndex: date.getDay(),
        };
      }

      weeklyData[dayName].transactions += 1;
      weeklyData[dayName].amount += Math.abs(transaction.amount);
    });

    const weeklyActivityData: WeeklyActivityData[] = Object.values(weeklyData)
      .sort((a, b) => a.dayIndex - b.dayIndex)
      .map(({ dayIndex, ...rest }) => rest);

    // Process category spending data
    const categoryData: Record<string, CategorySpendingData> = {};
    const categoryColors: Record<string, string> = {
      "Food & Dining": "#FF6B6B",
      Shopping: "#4ECDC4",
      Transportation: "#45B7D1",
      Entertainment: "#96CEB4",
      "Bills & Utilities": "#FFEAA7",
      Healthcare: "#DDA0DD",
      Education: "#74B9FF",
      Travel: "#FD79A8",
      Investment: "#FDCB6E",
      Others: "#A29BFE",
    };

    transactions.forEach((transaction: Transaction) => {
      if (transaction.type === "debit") {
        // Only count expenses for category breakdown
        const category = transaction.category || "Others";
        if (!categoryData[category]) {
          categoryData[category] = {
            name: category,
            value: 0,
            color: categoryColors[category] || "#A29BFE",
          };
        }
        categoryData[category].value += Math.abs(transaction.amount);
      }
    });

    const categorySpendingData: CategorySpendingData[] = Object.values(
      categoryData
    )
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories

    // Calculate stats
    const totalIncome = transactions
      .filter((t: Transaction) => t.type === "credit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter((t: Transaction) => t.type === "debit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return {
      monthlySpendingData,
      weeklyActivityData,
      categorySpendingData,
      stats: { totalIncome, totalExpenses },
    };
  }, [transactions]);

  // Mock credit cards data (you can replace this with actual data from paymentMethods)
  const creditCards = useMemo((): CreditCardData[] => {
    if (!paymentMethods.length) return [];

    const creditCardGroup = paymentMethods.find(
      (group: PaymentGroup) =>
        group.name.toLowerCase().includes("credit") ||
        group.name.toLowerCase().includes("card")
    );

    if (!creditCardGroup?.methods?.length) {
      return [
        {
          id: "1",
          type: "visa",
          number: "•••• •••• •••• ••••",
          holder: name || "User",
          expires: "••/••",
          isActive: true,
          usage: true,
        },
      ];
    }

    return creditCardGroup.methods
      .slice(0, 2)
      .map((method: PaymentMethod, index: number) => ({
        id: method._id,
        type: method.details?.company?.toLowerCase().includes("visa")
          ? "visa"
          : method.details?.company?.toLowerCase().includes("master")
          ? "mastercard"
          : "visa",
        number: method.details?.cardNumber
          ? `${method.details.cardNumber}`
          : "•••• •••• •••• ••••",
        holder: method.details?.cardHolderName || name || "User",
        expires: method.details?.expiryDate || "••/••",
        isActive: method.active,
        usage: index === 0,
      }));
  }, [paymentMethods, name]);

  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    setLoading((prev: LoadingState) => ({ ...prev, fetch: true }));
    try {
      const res = await fetch(`/api/transactions?user=${userId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();
      const transactionData: Transaction[] = data.transactions || [];
      setTransactions(transactionData);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to load transactions");
    } finally {
      setLoading((prev: LoadingState) => ({ ...prev, fetch: false }));
    }
  }, [userId]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    setRefreshing(false);
  };

  function getTotalMethods(paymentGroups: PaymentGroup[]): number {
    if (!Array.isArray(paymentGroups)) return 0;

    return paymentGroups.reduce((total: number, group: PaymentGroup) => {
      const count = Array.isArray(group.methods) ? group.methods.length : 0;
      return total + count;
    }, 0);
  }

  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await fetch(`/api/dashboard?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment group data");
        }
        const data: PaymentGroup[] = await response.json();
        setPaymentMethods(data);
      } catch (error: any) {
        console.error(error.message);
      }
    };
    if (userId) {
      fetchPaymentData();
    }
  }, [userId]);

  useEffect(() => {
    setTotalPaymentMethods(getTotalMethods(paymentMethods));
  }, [paymentMethods]);

  const latestTransactions = transactions.slice(0, 5);

  const totalExpenditure = transactions
    .filter((t: Transaction) => t.amount < 0 || t.type === "debit")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-6 space-y-6 lg:ml-64">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 lg:p-8 shadow-sm border"
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
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

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Total Income"
            value={`₹${processedData.stats.totalIncome.toLocaleString()}`}
            icon={DollarSign}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <StatCard
            title="Total Expenses"
            value={`₹${processedData.stats.totalExpenses.toLocaleString()}`}
            changeType="negative"
            icon={TrendingDown}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Transactions"
            value={transactions.length.toString()}
            icon={Activity}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <StatCard
            title="Payment Methods"
            value={totalPaymentMethods.toString()}
            icon={CreditCardIcon}
          />
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Credit Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {creditCards.map((card: CreditCardData, index: number) => (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <CreditCard
                  type={card.type}
                  number={card.number}
                  holder={card.holder}
                  expires={card.expires}
                  status={true}
                />
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Financial Analytics</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant={activeChart === "spending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveChart("spending")}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Spending
                  </Button>
                  <Button
                    variant={activeChart === "activity" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveChart("activity")}
                  >
                    <Activity className="w-4 h-4 mr-1" />
                    Activity
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {activeChart === "spending" && (
                    <ResponsiveContainer width="100%" height="100%">
                      {processedData.monthlySpendingData.length > 0 ? (
                        <AreaChart data={processedData.monthlySpendingData}>
                          <defs>
                            <linearGradient
                              id="spendingGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#f97316"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#f97316"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                            <linearGradient
                              id="incomeGradient"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor="#22c55e"
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor="#22c55e"
                                stopOpacity={0.1}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: any) => [
                              `₹${value.toLocaleString()}`,
                              "",
                            ]}
                          />
                          <Area
                            type="monotone"
                            dataKey="spending"
                            stroke="#f97316"
                            fill="url(#spendingGradient)"
                            name="Spending"
                          />
                          <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#22c55e"
                            fill="url(#incomeGradient)"
                            name="Income"
                          />
                        </AreaChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No spending data available
                        </div>
                      )}
                    </ResponsiveContainer>
                  )}

                  {activeChart === "activity" && (
                    <ResponsiveContainer width="100%" height="100%">
                      {processedData.weeklyActivityData.length > 0 ? (
                        <BarChart data={processedData.weeklyActivityData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip
                            formatter={(value: any, name: string) => [
                              name === "transactions"
                                ? `${value} transactions`
                                : `₹${value.toLocaleString()}`,
                              name === "transactions"
                                ? "Transactions"
                                : "Amount",
                            ]}
                          />
                          <Bar
                            dataKey="transactions"
                            fill="#3b82f6"
                            name="transactions"
                          />
                        </BarChart>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          No activity data available
                        </div>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => router.push("/transactions")}
                  className="text-orange-600"
                >
                  View all
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading.fetch ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : latestTransactions.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">
                      Latest {latestTransactions.length} transactions
                    </p>
                    {latestTransactions.map((transaction: Transaction) => (
                      <motion.div
                        key={transaction._id}
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.01 }}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              transaction.type === "credit"
                                ? "bg-green-100"
                                : "bg-red-100"
                            }`}
                          >
                            <span
                              className={`w-5 h-5 flex items-center justify-center ${
                                transaction.type === "credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {transaction.name}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <span>{transaction.paymentGroup?.name}</span>
                              <span>•</span>
                              <span>{transaction.category}</span>
                              <span>•</span>
                              <Badge variant="outline" className="text-xs">
                                {transaction.paymentMethod?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}₹
                            {Math.abs(transaction.amount).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </>
                ) : (
                  <div className="flex items-center justify-center py-8 text-gray-500">
                    No transactions available
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Spending Goals */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Spending Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Monthly Budget
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ₹50,000
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (totalExpenditure / 50000) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Spent: ₹{totalExpenditure.toLocaleString()}</span>
                    <span>
                      Remaining: ₹
                      {Math.max(50000 - totalExpenditure, 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      Savings Goal
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      ₹1,00,000
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          (processedData.stats.totalIncome / 100000) * 100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>
                      Saved: ₹{processedData.stats.totalIncome.toLocaleString()}
                    </span>
                    <span>Goal: ₹1,00,000</span>
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Set New Goal
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          {/* spending by category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <DoughnutChart />

                <div className="mt-6 space-y-3">
                  {processedData.categorySpendingData.length > 0 ? (
                    <>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-500">
                          {Math.round(
                            (processedData.categorySpendingData[0]?.value /
                              processedData.categorySpendingData.reduce(
                                (sum, cat) => sum + cat.value,
                                0
                              )) *
                              100
                          )}
                          %
                        </div>
                        <div className="text-sm text-gray-600">
                          {processedData.categorySpendingData[0]?.name ||
                            "Top Category"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        {processedData.categorySpendingData
                          .slice(0, 5)
                          .map(
                            (category: CategorySpendingData, index: number) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center space-x-2">
                                  <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  ></div>
                                  <span>{category.name}</span>
                                </div>
                                <span className="font-medium">
                                  ₹{category.value.toLocaleString()}
                                </span>
                              </div>
                            )
                          )}
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Total Expenses</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
                            <span className="font-bold">
                              ₹
                              {processedData.stats.totalExpenses.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      No category data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {processedData.categorySpendingData.length > 0 ? (
                    processedData.categorySpendingData.map(
                      (category: CategorySpendingData, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: category.color }}
                            ></div>
                            <span className="text-sm font-medium text-gray-700">
                              {category.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-bold text-gray-900">
                              ₹{category.value.toLocaleString()}
                            </span>
                            <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className="h-1.5 rounded-full transition-all duration-300"
                                style={{
                                  width: `${
                                    (category.value /
                                      Math.max(
                                        ...processedData.categorySpendingData.map(
                                          (c: CategorySpendingData) => c.value
                                        )
                                      )) *
                                    100
                                  }%`,
                                  backgroundColor: category.color,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="flex items-center justify-center py-8 text-gray-500">
                      No category data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Bottom Section - Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Activity Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {processedData.weeklyActivityData.length > 0 ? (
                    <LineChart data={processedData.weeklyActivityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [
                          `₹${value.toLocaleString()}`,
                          "Amount",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="#f97316"
                        strokeWidth={3}
                        dot={{ fill: "#f97316", r: 6 }}
                        name="Amount"
                      />
                    </LineChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      No weekly activity data available
                    </div>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
