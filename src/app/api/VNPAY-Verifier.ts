// pages/api/vnpay/verify-payment.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { VNPay } from 'vnpay';

const vnp = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE as string,
  secureSecret: process.env.VNP_HASH_SECRET as string,
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
});

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const query = req.body;

    try {
      const verify = vnp.verifyReturnUrl(query);
      if (verify.isVerified) {
        // Payment is verified
        res.status(200).json({ success: true });
      } else {
        // Verification failed
        res.status(400).json({ success: false });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ success: false });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
