"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  Calculator,
  Search,
  Filter,
  Download,
  Plus,
  ArrowUpDown,
  MoreHorizontal,
  Trash2,
  Eye,
  Edit2,
  Loader2,
  AlertTriangle,
  FileText,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";
import { getRandomIconBg } from "@/lib/randombg";
import { toast } from "sonner"; // Add your toast library

interface Transaction {
  _id: string;
  name: string;
  amount: number;
  category: string;
  type: "credit" | "debit";
  date: string;
  notes?: string;
  paymentGroup: { name: string; _id: string };
  paymentMethod: { name: string; _id: string };
}

interface FormData {
  id: string;
  user: string;
  paymentGroup: string;
  paymentMethod: string;
  amount: string;
  category: string;
  date: string;
  notes: string;
  name: string;
  type: string;
}

const filterTabs = [
  { label: "All", key: "all" },
  { label: "Income", key: "income" },
  { label: "Transfer", key: "transfer" },
  { label: "Entertainment", key: "entertainment" },
  { label: "Shopping", key: "shopping" },
  { label: "Food", key: "food" },
  { label: "Completed", key: "completed" },
];

const categories = [
  "Income",
  "Transfer",
  "Entertainment",
  "Shopping",
  "Food",
  "Transportation",
  "Utilities",
  "Healthcare",
  "Other",
];

const paymentTypes = [
  { id: "credit", name: "Credit (+)" },
  { id: "debit", name: "Debit (-)" },
];

const initialFormData: FormData = {
  id: "",
  user: "",
  paymentGroup: "",
  paymentMethod: "",
  amount: "",
  category: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  name: "",
  type: "",
};

export default function TransactionsPage() {
  // State management
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [transactionToUpdate, setTransactionToUpdate] =
    useState<Transaction | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [paymentMethodByGroup, setPaymentMethodByGroup] = useState<any[]>([]);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransactionNotes, setSelectedTransactionNotes] = useState<{
    name: string;
    notes: string;
  } | null>(null);

  // Loading states
  const [loading, setLoading] = useState({
    fetch: true,
    save: false,
    delete: false,
  });

  const { paymentMethods: paymentGroups, userId } = useAuth();

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!userId) return;

    setLoading((prev) => ({ ...prev, fetch: true }));
    try {
      const res = await fetch(`/api/transactions?user=${userId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await res.json();
      const transactionData = data.transactions || [];
      setTransactions(transactionData);
      setFilteredTransactions(transactionData);
    } catch (err: any) {
      console.error(err.message);
      toast.error("Failed to load transactions");
    } finally {
      setLoading((prev) => ({ ...prev, fetch: false }));
    }
  }, [userId]);

  // Fetch payment methods for selected group
  const fetchPaymentMethods = useCallback(async (groupId: string) => {
    if (!groupId) {
      setPaymentMethodByGroup([]);
      return;
    }

    try {
      const res = await fetch(`/api/payment-groups/${groupId}`);
      if (!res.ok) throw new Error("Failed to fetch payment methods");

      const data = await res.json();
      setPaymentMethodByGroup(data.methods || []);
    } catch (error) {
      console.error(error);
      setPaymentMethodByGroup([]);
      toast.error("Failed to load payment methods");
    }
  }, []);

  const openNotesModal = (transaction: Transaction) => {
    setSelectedTransactionNotes({
      name: transaction.name,
      notes: transaction.notes || "No notes available",
    });
    setNotesModalOpen(true);
  };

  const closeNotesModal = () => {
    setNotesModalOpen(false);
    setSelectedTransactionNotes(null);
  };

  // Effects
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchPaymentMethods(formData.paymentGroup);
  }, [formData.paymentGroup, fetchPaymentMethods]);

  // Filter and search transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Apply category filter
    if (activeFilter !== "all") {
      filtered = filtered.filter(
        (transaction) =>
          transaction.category.toLowerCase() === activeFilter.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          transaction.paymentGroup.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTransactions(filtered);
  }, [transactions, activeFilter, searchTerm]);

  // Modal handlers
  const openCreateModal = () => {
    setFormData({ ...initialFormData, user: userId as string });
    setModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setIsEditing(true);
    setTransactionToUpdate(transaction)
    setFormData({
      id: transaction._id,
      user: userId as string,
      paymentGroup: transaction.paymentGroup._id,
      paymentMethod: transaction.paymentMethod._id,
      amount: Math.abs(transaction.amount).toString(),
      category: transaction.category,
      date: new Date(transaction.date).toISOString().slice(0, 10),
      notes: transaction.notes || "",
      name: transaction.name,
      type: transaction.type,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setModalOpen(false);
    setFormData(initialFormData);
  };

  // Form handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Reset payment method when payment group changes
    if (name === "paymentGroup") {
      setFormData((prev) => ({ ...prev, paymentMethod: "" }));
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const { paymentGroup, paymentMethod, amount, category, date, name, type } =
      formData;

    if (!paymentGroup) {
      toast.error("Please select a payment group");
      return false;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return false;
    }
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return false;
    }
    if (!category) {
      toast.error("Please select a category");
      return false;
    }
    if (!date) {
      toast.error("Please select a date");
      return false;
    }
    if (!name.trim()) {
      toast.error("Please enter a transaction name");
      return false;
    }
    if (!type) {
      toast.error("Please select transaction type");
      return false;
    }

    return true;
  };

  // API operations
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading((prev) => ({ ...prev, save: true }));

    try {
      const payload = {
        ...formData,
        user: userId,
        amount: parseFloat(formData.amount),
      };

      const url = isEditing
        ? `/api/transactions/${transactionToUpdate && transactionToUpdate._id}`
        : "/api/transactions";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to save transaction");
      }

      toast.success(
        `Transaction ${isEditing ? "updated" : "created"} successfully!`
      );
      closeModal();
      await fetchTransactions();
    } catch (error: any) {
      console.error("Error saving transaction:", error);
      toast.error(error.message || "Failed to save transaction");
    } finally {
      setLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete?._id) return;

    setLoading((prev) => ({ ...prev, delete: true }));

    try {
      const response = await fetch(
        `/api/transactions/${transactionToDelete._id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }

      toast.success("Transaction deleted successfully!");
      setDeleteDialogOpen(false);
      setTransactionToDelete(null);
      await fetchTransactions();
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast.error(error.message || "Failed to delete transaction");
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  // Calculate stats
  const stats = React.useMemo(() => {
    const totalIncome = transactions
      .filter((t) => t.type === "credit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === "debit")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    return { totalIncome, totalExpenses };
  }, [transactions]);

  // Render payment method selector
  const renderPaymentMethodSelector = () => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Payment Method *
      </label>
      <Select
        value={formData.paymentMethod}
        onValueChange={(value) => handleSelectChange("paymentMethod", value)}
      >
        <SelectTrigger className="w-[95%] mx-auto h-12 bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
          <SelectValue placeholder="Select payment method">
            {formData.paymentMethod && paymentMethodByGroup.length > 0 && (
              <div className="flex items-center gap-3">
                {(() => {
                  const selectedMethod = paymentMethodByGroup.find(
                    (method) => method._id === formData.paymentMethod
                  );
                  if (!selectedMethod) return "Select payment method";

                  const paymentGroupName =
                    paymentGroups
                      .find((group) => group._id === formData.paymentGroup)
                      ?.name?.toLowerCase() || "";

                  const isCardType =
                    paymentGroupName.includes("card") ||
                    paymentGroupName.includes("credit") ||
                    paymentGroupName.includes("debit");

                  return (
                    <>
                      <div
                        className={`flex-shrink-0 w-8 h-5 rounded-md flex items-center justify-center shadow-sm ${
                          isCardType
                            ? "bg-gradient-to-br from-gray-700 to-gray-900"
                            : "bg-gradient-to-br from-orange-500 to-red-600"
                        }`}
                      >
                        <div className="w-4 h-2.5 bg-white/95 rounded-sm flex items-center justify-center">
                          <div className="text-[6px] font-bold text-gray-700 tracking-tight">
                            {isCardType ? "CARD" : "PAY"}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900 text-sm truncate">
                            {selectedMethod.name}
                          </span>
                          {isCardType && (
                            <span className="bg-gray-100 text-gray-700 font-mono px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider">
                              ••
                              {selectedMethod?.details?.cardNumber?.slice(-4) ||
                                "0000"}
                            </span>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className="rounded-lg border border-gray-200 shadow-lg bg-white max-h-64">
          <div className="max-h-60 overflow-y-auto p-1">
            {paymentMethodByGroup.length > 0 ? (
              paymentMethodByGroup.map((method, idx) => {
                const paymentGroupName =
                  paymentGroups
                    .find((group) => group._id === formData.paymentGroup)
                    ?.name?.toLowerCase() || "";

                const isCardType =
                  paymentGroupName.includes("card") ||
                  paymentGroupName.includes("credit") ||
                  paymentGroupName.includes("debit");

                return (
                  <SelectItem
                    key={method._id || idx}
                    value={method._id}
                    className="p-0 w-full block focus:bg-transparent data-[highlighted]:bg-transparent rounded-lg mb-2 last:mb-0"
                  >
                    <div className="flex items-center gap-3 p-3 w-full rounded-lg border border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200">
                      <div
                        className={`flex-shrink-0 w-10 h-6 rounded-md flex items-center justify-center shadow-sm ${
                          isCardType
                            ? "bg-gradient-to-br from-gray-700 to-gray-900"
                            : "bg-gradient-to-br from-orange-500 to-red-600"
                        }`}
                      >
                        <div className="w-5 h-3 bg-white/95 rounded-sm flex items-center justify-center">
                          <div className="text-[7px] font-bold text-gray-700 tracking-tight">
                            {isCardType ? "CARD" : "PAY"}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate mb-0.5">
                          {method.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-gray-500">
                            {isCardType ? "Card" : "Account"}
                          </span>
                          <span className="text-gray-300">•</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              isCardType
                                ? "bg-gray-100 text-gray-700 font-mono tracking-wider"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {isCardType
                              ? `••${
                                  method?.details?.cardNumber?.slice(-4) ||
                                  "0000"
                                }`
                              : method?.details?.upiId ||
                                method?.details?.accountNumber?.slice(-4) ||
                                "Details"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                );
              })
            ) : (
              <div className="flex items-center justify-center gap-2 p-4 text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed border-gray-200 m-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  No payment methods available
                </span>
              </div>
            )}
          </div>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Delete Transaction
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete this transaction? This action
              cannot be undone.
            </p>

            {transactionToDelete && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${getRandomIconBg()}`}
                  >
                    {transactionToDelete.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {transactionToDelete.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      ₹{Math.abs(transactionToDelete.amount).toFixed(2)} •{" "}
                      {transactionToDelete.category}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading.delete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading.delete}
            >
              {loading.delete ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="p-4 lg:p-6 space-y-6 lg:ml-64">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Transactions
            </h1>
            <p className="text-gray-600">
              View, search, and filter all your transactions
            </p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <StatCard
            title="Total Income"
            value={`₹${stats.totalIncome.toFixed(2)}`}
            change="15.2%"
            changeType="positive"
            icon={DollarSign}
          />
          <StatCard
            title="Total Expenses"
            value={`₹${stats.totalExpenses.toFixed(2)}`}
            change="3.8%"
            changeType="negative"
            icon={TrendingDown}
          />
        </motion.div>

        {/* Transaction History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="shadow-sm border-gray-100">
            <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 space-y-4 lg:space-y-0">
              <div>
                <CardTitle className="text-lg text-gray-900">
                  Transaction History
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {filteredTransactions.length} of {transactions.length}{" "}
                  transactions
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all"
                  onClick={openCreateModal}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Transaction
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Quick Filters */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Quick filters
                </p>
                <div className="flex flex-wrap gap-2">
                  {filterTabs.map((tab) => (
                    <Button
                      key={tab.key}
                      variant={activeFilter === tab.key ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveFilter(tab.key)}
                      className={
                        activeFilter === tab.key
                          ? "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 border-0"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    >
                      {tab.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Table Header - Hidden on mobile */}
              <div className="hidden lg:grid lg:grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div className="flex items-center space-x-1">
                  <span>Description</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
                <div>Category</div>
                <div>Method</div>
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </div>

              {/* Transaction List */}
              <div className="space-y-4">
                {loading.fetch ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                    <span className="ml-2 text-gray-600">
                      Loading transactions...
                    </span>
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <AnimatePresence>
                    {filteredTransactions.map((transaction) => (
                      <motion.div
                        key={transaction._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-3 px-3 items-center hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                      >
                        {/* Description */}
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border border-gray-300 ${getRandomIconBg()}`}
                          >
                            {transaction.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {transaction.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {transaction.paymentGroup.name}
                            </p>
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <p
                            className={`font-semibold ${
                              transaction.type === "credit"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}₹
                            {Math.abs(transaction.amount).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 lg:hidden">
                            {transaction.category}
                          </p>
                        </div>

                        {/* Category - Hidden on mobile */}
                        <div className="hidden lg:block">
                          <span className="text-gray-600 text-sm">
                            {transaction.category}
                          </span>
                        </div>

                        {/* Method */}
                        <div>
                          <Badge
                            variant="secondary"
                            className="bg-gray-100 text-gray-800 border-0 text-xs"
                          >
                            {transaction.paymentMethod.name}
                          </Badge>
                        </div>

                        {/* Date and Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 text-sm">
                            {new Date(transaction.date).toLocaleDateString(
                              "en-US",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                          <div className="flex justify-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-blue-50 group"
                              onClick={() => openNotesModal(transaction)}
                              title={
                                transaction.notes ? "View notes" : "No notes"
                              }
                            >
                              <FileText
                                className={`w-4 h-4 transition-colors ${
                                  transaction.notes
                                    ? "text-orange-600 group-hover:text-orange-700"
                                    : "text-gray-300 group-hover:text-gray-400"
                                }`}
                              />
                            </Button>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DropdownMenuItem
                                onClick={() => openEditModal(transaction)}
                                className="cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => {
                                  setTransactionToDelete(transaction);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-600 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <DollarSign className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium mb-2">
                      No transactions found
                    </p>
                    <p className="text-gray-400 text-sm mb-4">
                      {searchTerm || activeFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by adding your first transaction"}
                    </p>
                    {!searchTerm && activeFilter === "all" && (
                      <Button
                        onClick={openCreateModal}
                        variant="outline"
                        className="border-gray-300 hover:border-gray-400"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Transaction
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={isEditing ? "Edit Transaction" : "Add Transaction"}
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/* Payment Group */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Payment Group *
            </label>
            <Select
              value={formData.paymentGroup}
              onValueChange={(value) =>
                handleSelectChange("paymentGroup", value)
              }
            >
              <SelectTrigger className="w-[95%] mx-auto h-12 bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                <SelectValue placeholder="Select payment group" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 shadow-lg bg-white">
                {paymentGroups.map((group) => (
                  <SelectItem
                    key={group._id}
                    value={group._id}
                    className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer"
                  >
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          {formData.paymentGroup && renderPaymentMethodSelector()}

          {/* Transaction Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Type *
            </label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger className="w-[95%] mx-auto h-12 bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                <SelectValue placeholder="Select transaction type" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 shadow-lg bg-white">
                {paymentTypes.map((type) => (
                  <SelectItem
                    key={type.id}
                    value={type.id}
                    className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          type.id === "credit" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      {type.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger className="w-[95%] mx-auto h-12 bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 shadow-lg bg-white">
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="hover:bg-orange-50 focus:bg-orange-50 cursor-pointer"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Name */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Transaction Name *
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Coffee at Starbucks"
              className="h-12 w-[95%] mx-auto bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Amount *
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                ₹
              </span>
              <Input
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="pl-10 w-[95%] mx-auto h-12 bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                required
              />
            </div>
          </div>

          {/* Date */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Date *
            </label>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              className="h-12 w-[95%] mx-auto bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Notes <span className="text-gray-400">(optional)</span>
            </label>
            <Input
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any notes or description"
              className="h-12 w-[95%] mx-auto bg-white border-gray-200 rounded-lg hover:border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={loading.save}
              className="px-6 border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading.save}
              className="px-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading.save ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>{isEditing ? "Update Transaction" : "Create Transaction"}</>
              )}
            </Button>
          </div>
        </form>
      </Modal>
      <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl bg-white shadow-lg overflow-hidden border border-gray-200">
          {/* Header with subtle orange underline */}
          <DialogHeader className="px-6 pt-6 pb-3 border-b border-orange-300">
            <DialogTitle className="flex items-center gap-2 text-orange-600 font-semibold text-lg">
              <div className="p-1 bg-orange-100 rounded-md">
                <FileText className="w-5 h-5" />
              </div>
              Transaction Notes
            </DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="px-6 py-4">
            {selectedTransactionNotes && (
              <div>
                {/* Info card */}
                <div className="rounded-lg p-4 bg-orange-50">
                  <h4 className="text-orange-700 font-semibold text-sm mb-1 truncate">
                    {selectedTransactionNotes.name}
                  </h4>

                  {/* Notes box */}
                  <div className="bg-white rounded-md p-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full" />
                      <span className="uppercase text-xs font-medium text-gray-500 tracking-wide">
                        Notes
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm leading-snug whitespace-pre-wrap">
                      {selectedTransactionNotes.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
