// pages/api/vnpay/generate-payment-url.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { VNPay } from 'vnpay';

const vnp = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE as string,
  hashSecret: process.env.VNP_HASH_SECRET as string,
  returnUrl: process.env.VNP_RETURN_URL as string,
});

interface RequestBody {
  orderId: string;
  amount: number;
  orderInfo: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, amount, orderInfo }: RequestBody = req.body;

    try {
      const paymentUrl = vnp.buildPaymentUrl({
        amount,
        bankCode: 'NCB', // Optional: specify bank code
        orderId,
        orderInfo,
        orderType: 'billpayment',
        locale: 'vn',
      });

      res.status(200).json({ paymentUrl });
    } catch (error) {
      console.error('Error generating VNPAY URL:', error);
      res.status(500).json({ error: 'Failed to generate payment URL' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}