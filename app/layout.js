import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kakon's Diary",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
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
              <nav>
                <ul className="flex space-x-4">
                  <li>
                    <Link href="/" className="hover:underline">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/Report" className="hover:underline">
                      Monthly Report
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto pt-20 p-6">{children}</main>
          {/* Added `pt-20` to avoid overlap due to the fixed header */}
        </div>
      </body>
    </html>
  );
}
