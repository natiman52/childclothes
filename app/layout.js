import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "ሰላም ልብስ - Premium Kids Clothing",
  description: "ሰላም ልብስ provides the highest quality, most comfortable clothing for your little ones in Ethiopia.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import LoadingScreen from "@/components/LoadingScreen";
import Providers from "@/components/Providers";

export default function RootLayout({ children }) {


  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans overflow-x-hidden">
        <Providers>
          <CartProvider>
            <LoadingScreen />
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}

