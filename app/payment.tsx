import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import { BASE_URL } from '@/utils/endpoints';



const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentIntentClientSecret = async () => {
    try {
      // Call your backend to create a PaymentIntent
      const response = await axios.post(`${BASE_URL}/api/payments/create-payment-intent`, {
        amount: 2000, // Amount in cents
      });
  
      if (!response.data || !response.data.clientSecret) {
        throw new Error('Invalid response from backend. Missing clientSecret.');
      }
  
      return response.data.clientSecret;
    } catch (error:any) {
      if (error.response) {
        console.error('Backend Error:', error.response.data);
      } else if (error.request) {
        console.error('No Response from Backend:', error.request);
      } else {
        console.error('Error Setting Up Request:', error.message);
      }
      throw error; // Propagate the error for further handling
    }
  };
  

  const handlePayment = async () => {
    setLoading(true);
  
    try {
      // Fetch the client secret from the backend
      const clientSecret = await fetchPaymentIntentClientSecret();  // This should come from your server
  
      // Initialize the Payment Sheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: 'Your Merchant Name',  // Display the merchant name
      });
  
      if (initError) {
        console.error(initError);
        setLoading(false);
        return;
      }
  
      // Present the Payment Sheet
      const { error: paymentError } = await presentPaymentSheet();
  
      if (paymentError) {
        console.error(paymentError);
      } else {
        console.log('Payment completed successfully');
      }
    } catch (error) {
      console.error('Payment failed', error);
    }
  
    setLoading(false);
  };

  return (
    <View>
      <Text>Payment Screen</Text>
      <Button
        title={loading ? 'Processing Payment...' : 'Pay Now'}
        onPress={handlePayment}
        disabled={loading}
      />
    </View>
  );
};

export default PaymentScreen;
