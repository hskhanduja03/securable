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
import { getRandomGradient } from "@/lib/randombg";

interface PaymentMethodDetails {
  company: string;
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
}

interface PaymentMethod {
  details: PaymentMethodDetails;
  active: boolean;
  bgColor?: string;
}

export default function PaymentGroupDetailsPage() {
  const { groupName: groupId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [paymentMethodsOfGroup, setPaymentMethodsOfGroup] = useState<
    PaymentMethod[]
  >([]);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    holder: "",
    expires: "",
    cvc: "",
    company: "",
  });
  const { paymentMethods, userId } = useAuth();

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
      user: userId,
      group: groupId,
      name: `${cardDetails.company} Card`,
      active: true,
      details: {
        cardNumber: cardDetails.number,
        cardHolderName: cardDetails.holder,
        expiryDate: cardDetails.expires,
        cvv: cardDetails.cvc,
        company: cardDetails.company,
      },
      bgColor: getRandomGradient(),
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
        setPaymentMethodsOfGroup((prev) => [...prev, data]);
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
            <CardTitle className="text-lg">
              Manage your {groupName}&apos;s
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {paymentMethodsOfGroup.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="border rounded-xl p-4 bg-gradient-to-r from-orange-50 to-orange-50/40"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <CreditCard
                  type={card.details.company}
                  number={card.details.cardNumber}
                  holder={card.details.cardHolderName}
                  expires={card.details.expiryDate}
                  status={card.active}
                  gradient={"from-orange-600 to-red-700"}
                  className="max-w-sm"
                />
                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Card Number</p>
                    <p className="font-semibold">{card.details.cardNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Expires</p>
                    <p className="font-semibold">{card.details.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Card Holder</p>
                    <p className="font-semibold">
                      {card.details.cardHolderName}
                    </p>
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
              status={true}
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
            <input
              className="w-full p-2 border rounded"
              placeholder="Card Company"
              value={cardDetails.company}
              onChange={(e) =>
                setCardDetails({ ...cardDetails, company: e.target.value })
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
