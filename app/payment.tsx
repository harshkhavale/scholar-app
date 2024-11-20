import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';



const PaymentScreen = () => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentIntentClientSecret = async () => {
    try {
      // Call your backend to create a PaymentIntent
      const response = await axios.post('http://localhost:5000/payments/create-payment-intent', {
        amount: 2000,  // For example, amount in cents (20.00 USD)
      });
      return response.data.clientSecret;
    } catch (error) {
      console.error('Error fetching payment intent', error);
      throw error;
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
