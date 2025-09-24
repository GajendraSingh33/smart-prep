// app/layout.tsx
import React from "react";
import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Exam Helper Bot",
  description: "Generate, practice, and download exam questions",
};

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            Exam Helper Bot
          </Link>
          <div className="flex space-x-4">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/generate"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Generate
            </Link>
            <Link
              href="/question-bank"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Question Bank
            </Link>
            <Link
              href="/question-bank/practice"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Practice
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 py-4 mt-10">
      <div className="max-w-7xl mx-auto text-center">
        Exam Helper Bot &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
