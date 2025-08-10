"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal
} from 'lucide-react';

const filterTabs = [
  { label: 'Income', active: false },
  { label: 'Transfer', active: false },
  { label: 'Entertainment', active: false },
  { label: 'Shopping', active: false },
  { label: 'Food', active: false },
  { label: 'Pending', active: false },
  { label: 'Completed', active: true },
];

const transactions = [
  {
    id: 1,
    name: 'From Pierre DC',
    type: 'Bank transfer',
    amount: -1024.00,
    category: 'Transfer',
    status: 'Completed',
    date: 'Nov 20, 2024',
    icon: 'P',
    iconBg: 'bg-pink-100 text-pink-600'
  },
  {
    id: 2,
    name: 'From Alessandro VN',
    type: 'Bank transfer',
    amount: +954.00,
    category: 'Transfer',
    status: 'Completed',
    date: 'Nov 20, 2024',
    icon: 'A',
    iconBg: 'bg-green-100 text-green-600'
  },
  {
    id: 3,
    name: 'Netflix Subscription',
    type: 'Recurring payment',
    amount: -15.99,
    category: 'Entertainment',
    status: 'Completed',
    date: 'Nov 20, 2024',
    icon: 'N',
    iconBg: 'bg-red-100 text-red-600'
  },
  {
    id: 4,
    name: 'Salary Payment',
    type: 'Direct deposit',
    amount: +5200.00,
    category: 'Income',
    status: 'Completed',
    date: 'Nov 19, 2024',
    icon: 'S',
    iconBg: 'bg-green-100 text-green-600'
  },
];

const sortOptions = [
  { label: 'Description', key: 'description' },
  { label: 'Amount', key: 'amount' },
  { label: 'Category', key: 'category' },
  { label: 'Status', key: 'status' },
  { label: 'Date', key: 'date' },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Completed');

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:ml-64">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
          <p className="text-gray-600">View, search, and filter all your transactions</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value="$12744.25"
          change="15.2%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Expenses"
          value="$3118.25"
          change="3.8%"
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Net Flow"
          value="+$9626.00"
          change="8.5%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Average Amount"
          value="$610.10"
          icon={Calculator}
        />
      </div>

      {/* Transaction History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-4 space-y-4 lg:space-y-0">
            <div>
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <p className="text-sm text-gray-600 mt-1">View, search, and filter all your transactions</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                This Month
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
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
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Quick Filters */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Quick filters</p>
              <div className="flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                  <Button
                    key={tab.label}
                    variant={activeFilter === tab.label ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(tab.label)}
                    className={activeFilter === tab.label ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 pb-3 border-b border-gray-200 text-sm font-medium text-gray-700">
              <div className="flex items-center space-x-1">
                <span>Description</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
              <div className="flex items-center space-x-1">
                <span>Amount</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
              <div>Category</div>
              <div>Status</div>
              <div className="flex items-center space-x-1">
                <span>Date</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </div>

            {/* Transaction List */}
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-3 items-center hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm ${transaction.iconBg}`}>
                      {transaction.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-gray-600">{transaction.category}</span>
                  </div>
                  
                  <div>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">{transaction.date}</span>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}