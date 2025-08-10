"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';
import { LineChart } from '@/components/charts/line-chart';
import { DoughnutChart } from '@/components/charts/doughnut-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  TrendingDown, 
  TrendingUp, 
  Percent,
  Download
} from 'lucide-react';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('Monthly');

  const tabs = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:ml-64">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your financial performance and insights</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value="$284,382"
          change="12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Total Expenses"
          value="$142,847"
          change="8.2%"
          changeType="negative"
          icon={TrendingDown}
        />
        <StatCard
          title="Net Profit"
          value="$141,535"
          change="23.1%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Savings Rate"
          value="49.7%"
          change="5.3%"
          changeType="positive"
          icon={Percent}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="xl:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Revenue vs Expenses</CardTitle>
              <div className="flex items-center space-x-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab(tab)}
                    className={activeTab === tab ? "bg-orange-500 hover:bg-orange-600" : ""}
                  >
                    {tab}
                  </Button>
                ))}
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue: 35k</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expenses: 52k</span>
                </div>
              </div>
              <LineChart />
            </CardContent>
          </Card>
        </motion.div>

        {/* Spending by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="text-lg">Spending by Category</CardTitle>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <DoughnutChart />
              
              <div className="mt-6 space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">35%</div>
                  <div className="text-sm text-gray-600">Shopping</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span>Shopping</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-300 rounded-full"></div>
                      <span>Transport</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Food</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                      <span>Entertainment</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
                      <span>Others</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total Expenses</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full"></div>
                      <span className="font-bold">7700</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}