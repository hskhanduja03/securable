"use client";

import React from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from "lucide-react";
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon: Icon,
  className = ""
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className={className}
    >
      <Card className="p-6 bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {changeType === 'positive' ? '+' : ''}{change}
                </span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-gray-50 rounded-lg">
              <Icon className="w-5 h-5 text-gray-600" />
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}