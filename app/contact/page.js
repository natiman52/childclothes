"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Contact form submitted:", formData);
        // Form submission logic will be implemented later
    };

    return (
        <div className="bg-white min-h-screen">
            {/* Header */}
            <section className="bg-secondary py-20 px-4">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-heading font-black mb-6">Get in Touch</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about our products, shipping, or just want to say hello.
                    </p>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Contact Info */}
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-2xl font-heading font-extrabold mb-8">Contact Information</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1">Phone</p>
                                            <p className="text-muted-foreground text-sm">+251 91 123 4567</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1">Email</p>
                                            <p className="text-muted-foreground text-sm">hello@selamlibs.com</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1">Office</p>
                                            <p className="text-muted-foreground text-sm">Bole Road, Addis Ababa<br />Ethiopia</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
                                            <MessageCircle size={24} />
                                        </div>
                                        <div>
                                            <p className="font-bold mb-1">Live Chat</p>
                                            <p className="text-muted-foreground text-sm">Mon-Fri: 9am - 5pm CST</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="h-80 bg-secondary rounded-2xl overflow-hidden relative border border-border">
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                    <div className="text-center">
                                        <MapPin size={48} className="mx-auto mb-4 opacity-20" />
                                        <p className="font-bold">Google Maps Placeholder</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl border border-border shadow-sm">
                            <h2 className="text-2xl font-heading font-extrabold mb-8">Send us a message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 rounded-md border border-border bg-secondary/30 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="Jane Doe"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            className="w-full px-4 py-3 rounded-md border border-border bg-secondary/30 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                            placeholder="jane@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Subject</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 rounded-md border border-border bg-secondary/30 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="How can we help?"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2">Message</label>
                                    <textarea
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-md border border-border bg-secondary/30 focus:bg-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                        placeholder="Write your message here..."
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full btn-primary py-4 flex items-center justify-center gap-2 text-lg"
                                >
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
