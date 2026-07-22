import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
});

export const MAIL_FROM = `"AC Marketplace" <${process.env.MAIL_USER}>`;
