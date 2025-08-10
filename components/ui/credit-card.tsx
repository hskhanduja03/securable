"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Target } from 'lucide-react';

interface CreditCardProps {
  type: 'visa' | 'mastercard';
  number: string;
  holder: string;
  expires: string;
  balance: string;
  status: 'active' | 'inactive';
  gradient?: string;
  className?: string;
}

export function CreditCard({
  type,
  number,
  holder,
  expires,
  balance,
  status,
  gradient = "from-orange-500 to-red-600",
  className = ""
}: CreditCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={className}
    >
      <Card className={`relative p-6 text-white bg-gradient-to-br ${gradient} border-0 shadow-lg overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold tracking-wider">
                {type.toUpperCase()}
              </span>
              <Badge variant={status === 'active' ? 'default' : 'secondary'} className="text-xs">
                {status}
              </Badge>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-xl font-bold tracking-widest">
              {number}
            </p>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs opacity-80 mb-1">CARD HOLDER NAME</p>
              <p className="font-medium">{holder}</p>
            </div>
            <div>
              <p className="text-xs opacity-80 mb-1">EXPIRY DATE</p>
              <p className="font-medium">{expires}</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}