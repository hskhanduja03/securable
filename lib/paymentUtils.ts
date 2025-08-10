
export const fetchPaymentGroups = async (userId: string) => {
  try {
    const res = await fetch(`/api/payment-groups?userId=${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch payment groups");
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.error(error);
    return []; 
  }
};
