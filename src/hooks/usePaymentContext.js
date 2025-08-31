import { useWalletClient } from "wagmi";
import { useCallback, useState } from "react";
import axios from "axios";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";

export function usePaymentContext() {
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [paymentStatus, setPaymentStatus] = useState({
    isProcessing: false,
    error: null,
    lastTransaction: null
  });

  const createSession = useCallback(async (amount = "$0.001") => {
    try {
      setPaymentStatus({ isProcessing: true, error: null, lastTransaction: null });
      
      // Validate wallet connection
      if (!walletClient || !walletClient.account) {
        const error = new Error("Please connect your wallet to continue");
        error.code = "WALLET_NOT_CONNECTED";
        throw error;
      }
      
      if (isError) {
        const error = new Error("There was a problem with your wallet connection");
        error.code = "WALLET_ERROR";
        throw error;
      }
      
      if (isLoading) {
        const error = new Error("Wallet is still initializing, please try again in a moment");
        error.code = "WALLET_LOADING";
        throw error;
      }
      
      // Create and configure API client
      const baseClient = axios.create({
        baseURL: "https://payments.vistara.dev",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000, // 15 second timeout
      });
      
      // Add payment interceptor
      const apiClient = withPaymentInterceptor(baseClient, walletClient);
      
      // Make payment request
      const response = await apiClient.post("/api/payment", { amount });
      const paymentResponse = response.config.headers["X-PAYMENT"];
      
      if (!paymentResponse) {
        const error = new Error("Payment response is missing");
        error.code = "PAYMENT_RESPONSE_MISSING";
        throw error;
      }
      
      // Decode and return payment response
      const decoded = decodeXPaymentResponse(paymentResponse);
      console.log(`Payment successful: ${JSON.stringify(decoded)}`);
      
      setPaymentStatus({ 
        isProcessing: false, 
        error: null, 
        lastTransaction: {
          id: decoded.id || 'unknown',
          amount: amount,
          timestamp: new Date().toISOString(),
          status: 'success'
        }
      });
      
      return decoded;
    } catch (error) {
      console.error("Payment error:", error);
      
      // Format error message for display
      const errorMessage = error.code ? 
        error.message : 
        "There was a problem processing your payment. Please try again.";
      
      setPaymentStatus({ 
        isProcessing: false, 
        error: {
          message: errorMessage,
          code: error.code || 'UNKNOWN_ERROR',
          originalError: error
        },
        lastTransaction: null
      });
      
      throw error;
    }
  }, [walletClient, isError, isLoading]);

  const clearPaymentStatus = useCallback(() => {
    setPaymentStatus({
      isProcessing: false,
      error: null,
      lastTransaction: null
    });
  }, []);

  return { 
    createSession,
    clearPaymentStatus,
    isProcessingPayment: paymentStatus.isProcessing,
    paymentError: paymentStatus.error,
    lastTransaction: paymentStatus.lastTransaction
  };
}
