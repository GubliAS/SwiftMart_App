export async function mockProcessPayment(paymentDetails: any): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true, message: "Payment processed successfully (mock)." };
}

export default {}; 