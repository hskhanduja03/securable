"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useRouter } from "next/navigation";
import AppLoader from "@/components/ui/Loader";
import { useAuth } from "@/context/AuthContext";
import { fetchPaymentGroups } from "@/lib/paymentUtils"; // Import the utility function

export default function PaymentMethodsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();
  const { userId } = useAuth(); // Get userId from context

  const loadPaymentGroups = async () => {
    if (!userId) return;
    setLoading(true);

    const fetchedGroups = await fetchPaymentGroups(userId); // Use the utility function to fetch groups
    setGroups(fetchedGroups);

    setLoading(false);
  };

  useEffect(() => {
    if (userId) {
      loadPaymentGroups(); // Fetch groups only if userId exists
    }
  }, [userId]);

  const handleGroupClick = (id: string) => {
    setLoading(true);
    router.push(`/paymentgroups/${id}`);
  };
  const {addPaymentMethod} = useAuth()

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/payment-groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newName,
        description,
        userId,
      }),
    });

    if (res.ok) {
      const newGroup = await res.json(); // Adjust this based on your API response

      // Add the new payment method to context
      addPaymentMethod(newGroup);
      setGroups((prev) => [...prev, newGroup]);
      setNewName("");
      setDescription("");
      setIsModalOpen(false);
    } else {
      alert("Failed to create payment group.");
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <AppLoader
        title="Loading Data"
        message="Redirecting you to the selected payment group..."
        icon={
          <Loader2 className="w-10 h-10 text-white drop-shadow-md animate-spin" />
        }
      />
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 lg:ml-64 select-none">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600">
            Manage your cards, UPI IDs, and payment accounts easily.
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Group
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {groups.map((group, i) => (
          <motion.div
            key={group._id} // Ensure that you're using group._id here
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleGroupClick(group._id)}
            className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:from-gray-100 hover:to-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-lg text-gray-900">
                  {group.name}
                </p>
                <p className="text-sm text-gray-500">
                  Last Used: {group.lastUsed}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-900">
                  {group.totalBalance}
                </p>
                <p className="text-sm text-gray-500">
                  Total Methods: {group.totalMethods}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Payment Group"
      >
        <form className="space-y-4" onSubmit={handleSave}>
          <input
            type="text"
            placeholder="Group Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
          />
          <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            Save Group
          </Button>
        </form>
      </Modal>
    </div>
  );
}
