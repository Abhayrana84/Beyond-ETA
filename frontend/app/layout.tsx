import React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Beyond-ETA - Smart, Safe & Sustainable Travel',
  description: 'AI-powered navigation system that considers safety, health, and environment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950">
        {children}
      </body>
    </html>
  );
}
