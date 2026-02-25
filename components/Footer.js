import Link from "next/link";
import { ArrowRight, Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-secondary py-16 mt-auto">
            <div className="container mx-auto px-4">
                {/* Support Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">ጥያቄ አሎት?</h3>
                        <Link href="/faq" className="text-xl font-heading font-bold flex items-center gap-2 hover:text-primary transition-colors">
                            Read our FAQ <ArrowRight size={20} className="text-primary" />
                        </Link>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">የደንበኛ ድጋፍ</h3>
                        <p className="text-xl font-heading font-bold">+251 97 269 2781</p>
                    </div>
                    {/* <div className="flex flex-col items-center md:items-end text-center md:text-right">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Looking for our products?</h3>
                        <Link href="/retailers" className="text-xl font-heading font-bold flex items-center gap-2 hover:text-primary transition-colors">
                            Find a retailer <ArrowRight size={20} className="text-primary" />
                        </Link>
                    </div> */}
                </div>

                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <Link href="/" className="text-3xl font-heading font-black tracking-tighter text-foreground mb-4">
                            ሰላም ልብስ
                        </Link>
                        <p className="text-muted-foreground mb-6">
                            ፕሪሚየም የልጆች ልብስ ለምቾት እና ለቅጥነት የተነደፈ። እያንዳንዱ ክፍል ለትንንሽ ልጆቻችሁ በፍቅር ተዘጋጅቷል
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="hover:text-primary transition-colors border border-secondary p-2 rounded-full"><Instagram size={20} /></Link>
                            <Link href="#" className="hover:text-primary transition-colors border border-secondary p-2 rounded-full"><Facebook size={20} /></Link>
                            <Link href="#" className="hover:text-primary transition-colors border border-secondary p-2 rounded-full"><Twitter size={20} /></Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Information</h3>
                        <ul className="space-y-3">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">Shop All</Link></li>
                            <li><Link href="/faq" className="hover:text-primary transition-colors">Support / FAQ</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Legal</h3>
                        <ul className="space-y-3">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter & Contact */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">Contact</h3>

                        <div className="text-sm">
                            <p className="text-muted-foreground">+251 97 269 2781</p>
                            <p className="text-muted-foreground">natnealyaza23@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-secondary flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>© Made by <span className="text-primary">Abysinia Tech</span>. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                        <Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
