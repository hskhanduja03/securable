"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';
import { CreditCard } from '@/components/ui/credit-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard as CreditCardIcon, 
  TrendingUp, 
  Shield,
  Plus,
  Copy,
  Download,
  Eye
} from 'lucide-react';

const cardData = [
  {
    type: 'visa' as const,
    number: '3455 4562 7710 3507',
    holder: 'Alexander Munoz',
    expires: '02/30',
    balance: '$34,938 EUR',
    status: 'active' as const,
    gradient: 'from-orange-500 to-red-600'
  },
  {
    type: 'mastercard' as const,
    number: '5412 7534 8912 3456',
    holder: 'John Carter',
    expires: '05/31',
    balance: '$12,847.5 EUR',
    status: 'active' as const,
    gradient: 'from-gray-600 to-gray-800'
  },
  {
    type: 'visa' as const,
    number: '4532 1234 5678 9012',
    holder: 'John Carter',
    expires: '08/29',
    balance: '$0.00 EUR',
    status: 'inactive' as const,
    gradient: 'from-blue-500 to-cyan-600'
  }
];

export default function CardsPage() {
  return (
    <div className="p-4 lg:p-6 space-y-6 lg:ml-64">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Cards</h1>
          <p className="text-gray-600">Manage your payment cards and balances</p>
        </div>
        <Button className="mt-4 lg:mt-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
          <Plus className="w-4 h-4 mr-2" />
          Add New Card
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Balance"
          value="$53,407.25"
          change="12.5%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatCard
          title="Active Cards"
          value="2/3"
          icon={CreditCardIcon}
        />
        <StatCard
          title="Average Balance"
          value="$17,802.417"
          change="8.3%"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatCard
          title="Security Status"
          value="1 Locked"
          icon={Shield}
        />
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Your Cards */}
        <div className="xl:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-lg">Your Cards</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Manage your payment cards and balances</p>
                </div>
                <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Card
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {cardData.map((card, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-orange-200 rounded-xl p-4 bg-orange-50/30"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                      <CreditCard
                        type={card.type}
                        number={card.number}
                        holder={card.holder}
                        expires={card.expires}
                        balance={card.balance}
                        status={card.status}
                        gradient={card.gradient}
                        className="max-w-sm"
                      />
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Balance</p>
                            <p className="font-semibold">{card.balance}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Card Number</p>
                            <p className="font-semibold">•••• {card.number.slice(-4)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Expires</p>
                            <p className="font-semibold">{card.expires}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Card Holder</p>
                            <p className="font-semibold">{card.holder}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Card Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-gray-900">$34,938 EUR</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Type</span>
                  <span className="font-medium">VISA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Holder</span>
                  <span className="font-medium">Alexander Munoz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Card Number</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">•••• •••• •••• 3507</span>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Expiry Date</span>
                  <span className="font-medium">02/30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Security</span>
                  <Badge className="bg-green-100 text-green-800">Unlocked</Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <Button variant="outline" size="sm" className="w-full">
                  <Eye className="w-4 h-4 mr-2" />
                  Show Card Number
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Statement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}