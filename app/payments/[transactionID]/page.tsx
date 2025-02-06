"use client"

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// Types for our booking data
interface BookingDetails {
  id: string;
  transaction_id: string;
  card_token: string;
  amount: string;
  created_at: string;
  customer_name: string;
  cardName: string;
  cardExpiryMonth: string;
  cardExpiryYear: string;
  cardNumberFirst: string;
  cardNumberLast: string;
}

function getCardType(cardNumberFirst: string) {
  const firstDigit = cardNumberFirst[0];
  switch (firstDigit) {
    case '4':
      return 'visa';
    case '5':
      return 'mastercard';
    case '3':
      return 'amex';
    default:
      return 'default';
  }
}

export default function BookingPage() {
  const { transactionID } = useParams();
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cvc, setCvc] = useState('');
  const [cvcError, setCvcError] = useState<string | null>(null);
  const [showCvc, setShowCvc] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/payment/${transactionID}`);
        const result = await response.json();

        if (!response.ok) throw new Error(result.error);
        setBookingDetails(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch booking details');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (transactionID) {
      fetchBookingDetails();
    }
  }, [transactionID]);

  const validateCvc = (value: string) => {
    const isValid = /^[0-9]{3,4}$/.test(value);
    setCvcError(isValid ? null : 'CVC must be 3 or 4 digits');
    return isValid;
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    setCvc(value);
    validateCvc(value);
  };

  const toggleCvcVisibility = () => {
    setShowCvc(!showCvc);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateCvc(cvc)) {
      // Handle CVC submission logic here
      console.log('CVC submitted:', cvc);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen fade-in">
        <img src="/loadding.svg" alt="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen fade-in">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  const cardType = getCardType(bookingDetails?.cardNumberFirst || '');

  return (
    <div className="relative container mx-auto p-6 max-w-lg fade-in border border-gray-300">
      <div className="relative z-10">
        <h1 className="text-3xl font-bold mb-4 text-center text-indigo-600 slide-up">
          Security Deposit Booking ID
        </h1>
        <p className="text-center mb-6 text-gray-500 slide-up">{transactionID}</p>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 slide-up">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-blue-700">Customer Information</h2>
            <p className="font-medium text-lg">Customer Name: {bookingDetails?.customer_name}</p>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-300 slide-up">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-blue-700">Card Detail</h2>
            <div className="flex items-center mt-4 pr-4">
              <div className="mr-4">
                <img src={`/${cardType}.svg`} alt="Card" className="w-16 h-12 border" />
              </div>
              <div>
                <p className="font-medium text-lg">{bookingDetails?.cardName}</p>
                <p className="font-medium text-lg">{bookingDetails?.cardNumberFirst} **** **** {bookingDetails?.cardNumberLast}</p>
                <p className="font-medium text-lg">{bookingDetails?.cardExpiryMonth}/{bookingDetails?.cardExpiryYear}</p>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 border border-gray-300 slide-up">
          <div className="mb-4 relative">
            <label className="block text-blue-700 font-semibold mb-2" htmlFor="cvc">
              Enter CVC
            </label>
            <input
              type={showCvc ? "text" : "password"}
              id="cvc"
              name="cvc"
              value={cvc}
              onChange={handleCvcChange}
              maxLength={4}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={toggleCvcVisibility}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
            >
              {showCvc ? "🙈" : "👁️"}
            </button>
            {cvcError && <p className="text-red-500 text-sm mt-1">{cvcError}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out slide-up"
          >
            Pay ${bookingDetails?.amount}
          </button>
        </form>
      </div>
    </div>
  );
}