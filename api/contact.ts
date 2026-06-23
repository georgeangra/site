import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, phone, service, message } = req.body || {};

  if (!name || !phone || !service || !message) {
    res.status(400).json({ error: 'Missing form fields' });
    return;
  }

  const receiver = process.env.CONTACT_RECEIVER || process.env.GMAIL_USER;

  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS || !receiver) {
    res.status(500).json({ error: 'Email service is not configured' });
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: receiver,
      subject: `Novo pedido de orçamento: ${service}`,
      text: `Nome: ${name}\nTelefone: ${phone}\nServiço: ${service}\nMensagem: ${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
}
