'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { Drawer, Button } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = () => setDrawerOpen(false);
  const openDrawer = () => setDrawerOpen(true);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-gray-100">
          {/* Fixed Header/Menu */}
          <header className="fixed top-0 left-0 w-full bg-blue-600 text-white py-4 shadow-md z-50">
            <div className="container mx-auto flex justify-between items-center px-4">
              <h1 className="text-2xl font-bold">Kakon's Diary</h1>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-4">
                <Link href="/" className="hover:underline">
                  Dashboard
                </Link>
                <Link href="/Report" className="hover:underline">
                  Monthly Report
                </Link>
              </nav>
              {/* Mobile Menu Icon */}
              <Button
                className="md:hidden"
                type="text"
                icon={<MenuOutlined style={{ fontSize: "20px", color: "white" }} />}
                onClick={openDrawer}
              />
            </div>
          </header>

          {/* Mobile Drawer Navigation */}
          <Drawer
            title="Kakon's Diary"
            placement="right"
            onClose={closeDrawer}
            open={drawerOpen}
            bodyStyle={{ padding: 0 }}
          >
            <ul className="space-y-4 p-4">
              <li>
                <Link href="/" className="text-lg" onClick={closeDrawer}>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/Report" className="text-lg" onClick={closeDrawer}>
                  Monthly Report
                </Link>
              </li>
            </ul>
          </Drawer>

          {/* Main Content */}
          <main className="container mx-auto pt-20 p-6">{children}</main>
          {/* Added `pt-20` to avoid overlap due to the fixed header */}
        </div>
      </body>
    </html>
  );
}
