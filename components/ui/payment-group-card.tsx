"use client";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function PaymentGroupCard({
  id,
  name,
  icon: Icon,
  totalMethods,
  totalBalance,
  lastUsed,
}: any) {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/paymentgroups/${id}`)}
      className={cn(
        "cursor-pointer rounded-2xl border border-orange-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 group"
      )}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-400/90 to-orange-500/90 text-white p-4 rounded-t-2xl flex items-center space-x-3">
        <div className="bg-white/20 p-2 rounded-lg">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="font-semibold text-lg">{name}</h3>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Total Methods</p>
            <p className="text-lg font-medium">{totalMethods}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Balance</p>
            <p className="text-lg font-medium">{totalBalance}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Last Used</p>
          <p className="text-sm font-medium text-gray-700">{lastUsed}</p>
        </div>
      </div>
    </Card>
  );
}
