"use client";

export default function PrivacyPage() {
    const lastUpdated = "February 23, 2026";

    return (
        <div className="bg-white min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Privacy Policy</h1>
                <p className="text-muted-foreground mb-12">Last updated: {lastUpdated}</p>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">1. Information We Collect</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We collect information you provide directly to us when you create an account, make a purchase, or contact us. This may include your name, phone number, shipping address, and payment information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">2. How We Use Your Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We use your information to process orders, communicate with you about your account and purchases, and provide customer support. We may also use your information to send you marketing communications if you have opted in.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">3. Information Sharing</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We do not sell your personal information. We may share your information with third-party service providers who perform services on our behalf, such as payment processing and shipping.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">4. Data Security</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We take reasonable measures to protect your personal information from loss, theft, and unauthorized access. However, no method of transmission over the internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">5. Cookies</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, but this may affect how our site functions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">6. Your Rights</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You have the right to access, update, or delete your personal information. If you would like to exercise these rights, please contact us using the information provided below.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-secondary">
                        <p className="text-sm text-muted-foreground">
                            If you have any questions about this Privacy Policy, please contact us at <span className="text-primary font-bold">privacy@debebe.com</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
