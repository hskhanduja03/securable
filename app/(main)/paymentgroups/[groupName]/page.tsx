"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreditCard } from "@/components/ui/credit-card";
import { StatCard } from "@/components/ui/stat-card";
import { Modal } from "@/components/ui/Modal";
import { useAuth } from "@/context/AuthContext";

const cardData = [
  {
    type: "icici" as const,
    number: "3455 4562 7710 3507",
    holder: "Alexander Munoz",
    expires: "02/30",
    balance: "$34,938 EUR",
    status: "active" as const,
    gradient: "from-orange-500 to-red-600",
  },
  {
    type: "hdfc" as const,
    number: "5412 7534 8912 3456",
    holder: "John Carter",
    expires: "05/31",
    balance: "$12,847.5 EUR",
    status: "active" as const,
    gradient: "from-gray-600 to-gray-800",
  },
  {
    type: "idfc" as const,
    number: "4532 1234 5678 9012",
    holder: "John Carter",
    expires: "08/29",
    balance: "$0.00 EUR",
    status: "inactive" as const,
    gradient: "from-blue-500 to-cyan-600",
  },
];

export default function PaymentGroupDetailsPage() {
  const { groupName: groupId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [paymentMethodsOfGroup, setPaymentMethodsOfGroup] = useState([]);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expires: "",
    cvc: "",
    company: "ICICI",
  });
  const { paymentMethods } = useAuth();
  console.log("paymentMethodsOfGroup", paymentMethodsOfGroup);

  useEffect(() => {
    const fetchPaymentGroupData = async () => {
      try {
        const response = await fetch(`/api/payment-groups/${groupId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment group data");
        }
        const data = await response.json();
        setGroupName(data.name); // Set group name based on API response
        setPaymentMethodsOfGroup(data.methods); // Set payment methods
      } catch (error: any) {
        console.error(error.message);
      }
    };
    if (groupId) {
      fetchPaymentGroupData();
    }
  }, [groupId]);

  useEffect(() => {
    // Check if the groupId matches an entry in the payment methods
    const matchedGroup = paymentMethods.find(
      (method) => method._id === groupId
    );
    if (matchedGroup) {
      setGroupName(matchedGroup.name); // Set the group name if a match is found
    }
  }, [groupId, paymentMethods]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle card number formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits

    // Add space after every 4 digits
    let formatted = value.match(/.{1,4}/g)?.join(" ") || "";
    setCardDetails({ ...cardDetails, number: formatted });
  };

  // Handles expiry date change
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length >= 3) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    } else if (value.length >= 2) {
      value = value.slice(0, 2) + "/";
    }

    setCardDetails({ ...cardDetails, expires: value });
  };

  // Handles form submission
  const handleSaveCard = async () => {
    const cardDataToSave = {
      user: "60d5f8c5b6f68d001c8b93fa", // Replace with actual user ID
      group: groupId, // Pass the current group ID
      name: `Card: ${cardDetails.company}`,
      active: true,
      details: {
        cardNumberLast4: cardDetails.number.slice(-4),
        cardHolderName: cardDetails.holder,
        expiryDate: cardDetails.expires,
        cvv: cardDetails.cvc,
        company: cardDetails.company,
      },
    };

    try {
      const response = await fetch("/api/payment-methods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cardDataToSave),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Card saved:", data);
        closeModal(); // Close the modal after saving
      } else {
        const errorData = await response.json();
        console.error("Error saving card:", errorData.error);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  const renderCards = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-white shadow-lg rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Your {groupName}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Manage your {groupName.toLowerCase()} and balances
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {cardData.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="border rounded-xl p-4 bg-gradient-to-r from-blue-50 to-green-50/40"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <CreditCard {...card} className="max-w-sm" />
                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Balance</p>
                    <p className="font-semibold">{card.balance}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Card Number</p>
                    <p className="font-semibold">
                      •••• {card.number.slice(-4)}
                    </p>
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
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="p-6 space-y-6 lg:ml-64">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold capitalize">{groupName} Details</h1>
        <Button
          className="mt-4 lg:mt-0 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
          onClick={openModal}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New {groupName}
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Balance"
          value="$12,500"
          change="4.1%"
          changeType="positive"
        />
        <StatCard
          title="Transactions"
          value="156"
          change="2.5%"
          changeType="negative"
        />
        <StatCard title="Avg. Transaction" value="$80" />
      </div>

      {/* Render cards */}
      {groupName.toLowerCase().includes("card")
        ? renderCards()
        : `Fetching ${groupName} methods`}

      {/* Modal for Add New */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={`Add New ${groupName}`}
      >
        {groupName.toLowerCase().includes("card") ? (
          <div className="space-y-6">
            <CreditCard
              type={cardDetails.company || "company"}
              number={cardDetails.number || "#### #### #### ####"}
              holder={cardDetails.holder || "FULL NAME"}
              expires={cardDetails.expires || "MM/YY"}
              status="active"
              gradient="from-purple-500 to-indigo-600"
              className="mx-auto"
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Card Number"
              value={cardDetails.number}
              onChange={handleCardNumberChange}
            />
            <input
              className="w-full p-2 border rounded"
              placeholder="Card Holder"
              value={cardDetails.holder}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, holder: e.target.value })
              }
            />
            <div className="flex gap-4">
              <input
                className="w-1/2 p-2 border rounded"
                placeholder="MM/YY"
                value={cardDetails.expires}
                onChange={handleExpiryChange}
              />
              <input
                className="w-1/2 p-2 border rounded"
                placeholder="CVC"
                value={cardDetails.cvc}
                onChange={(e) =>
                  setCardDetails({ ...cardDetails, cvc: e.target.value })
                }
              />
            </div>
            <Button className="w-full" onClick={handleSaveCard}>
              Save Card
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              placeholder={`Enter ${groupName}`}
            />
            <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Save {groupName}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
