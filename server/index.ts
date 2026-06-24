import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production or from ../dist/public during local development
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  console.log(`Serving static files from: ${staticPath}`);

  app.use(express.static(staticPath));
  app.use(express.json());

  // Email contact endpoint
  app.post("/api/contact", async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !phone || !service || !message) {
      res.status(400).json({ error: "Missing form fields" });
      return;
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_PASS;
    const contactReceiver = process.env.CONTACT_RECEIVER || gmailUser;

    if (!gmailUser || !gmailPass || !contactReceiver) {
      console.error("Email service is not configured");
      res.status(500).json({ error: "Email service is not configured" });
      return;
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const emailText = `Novo pedido de orçamento:\n\nNome: ${name}\nEmail: ${email}\nTelefone: ${phone}\nServiço: ${service}\nMensagem: ${message}`;

    try {
      await transporter.sendMail({
        from: gmailUser,
        to: contactReceiver,
        subject: `Orçamento do site: ${service}`,
        text: emailText,
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
