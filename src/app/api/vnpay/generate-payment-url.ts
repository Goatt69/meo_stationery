import { NextApiRequest, NextApiResponse } from 'next';
import { VNPay, ProductCode, VnpLocale, dateFormat } from 'vnpay';

const vnp = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE as string,
  secureSecret: process.env.VNP_HASH_SECRET as string,
  vnpayHost: 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { orderId, amount, orderInfo } = req.body;
  const clientIp = Array.isArray(req.headers['x-forwarded-for']) 
    ? req.headers['x-forwarded-for'][0] 
    : req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  try {
    const paymentUrl = vnp.buildPaymentUrl({
      vnp_Amount: amount * 100, // Convert to VNPay format
      vnp_IpAddr: clientIp as string,
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL as string,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date(Date.now() + 24 * 60 * 60 * 1000)),
    });

    res.status(200).json({ paymentUrl });
  } catch (error) {
    console.error('Error generating VNPAY URL:', error);
    res.status(500).json({ error: 'Failed to generate payment URL' });
  }
}
