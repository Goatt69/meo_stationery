// pages/api/vnpay/generate-payment-url.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { VNPay, ProductCode, VnpLocale } from 'vnpay';

const vnp = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE as string,
  secureSecret: process.env.VNP_HASH_SECRET as string,
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { orderId, amount, orderInfo } = req.body;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    try {
      const paymentUrl = vnp.buildPaymentUrl({
        vnp_Amount: amount, // Amount in VND
        vnp_IpAddr: clientIp as string,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: 'http://localhost:3000/vnpay-return',
        vnp_Locale: VnpLocale.VN, // 'vn' or 'en'
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
