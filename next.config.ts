import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pdfkit', 'nodemailer', 'fontkit'],
};

export default nextConfig;
