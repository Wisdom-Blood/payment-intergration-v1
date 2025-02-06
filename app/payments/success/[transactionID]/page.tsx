'use client'

import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Divide } from 'lucide-react'
import Link from 'next/link'

export default function PaymentSuccess() {
  const { transactionID } = useParams();
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 p-6 md:p-8 bg-white rounded-lg shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1
            }}
            className="flex justify-center"
          >
            <CheckCircle className="w-24 h-24 text-green-500" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Your payment has been processed successfully.
            </p>

          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-center text-sm text-gray-500"
        >
          <div className='cursor-pointer' onClick={() => router.push(`/payments/${transactionID}`)}>
            Go to Payment Detail Page
          </div>
        </motion.div>

      </motion.div>
    </div>
  )
} 