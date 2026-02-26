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
                            <Link href="https://x.com/natnaelyaza23" className="hover:text-primary transition-colors border border-secondary p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
                                    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                                </svg>
                            </Link>
                            <Link href="https://www.tiktok.com/@natnaelyaza" className="hover:text-primary transition-colors border border-secondary p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-tiktok" viewBox="0 0 16 16">
                                    <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                                </svg>
                            </Link>
                            <Link href="https://t.me/Js_Py_Kt" className="hover:text-primary transition-colors border border-secondary p-3 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09" />
                                </svg>
                            </Link>
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
