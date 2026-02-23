"use client";

export default function TermsPage() {
    const lastUpdated = "February 23, 2026";

    return (
        <div className="bg-white min-h-screen py-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">Terms & Conditions</h1>
                <p className="text-muted-foreground mb-12">Last updated: {lastUpdated}</p>

                <div className="prose prose-slate max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">1. Agreement to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            By accessing or using the De Bébé website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">2. Use of the Site</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            You may use our site for personal, non-commercial purposes only. You agree not to use the site for any unlawful purpose or in any way that could damage, disable, or impair the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">3. Intellectual Property</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            All content on this site, including text, graphics, logos, images, and software, is the property of De Bébé and is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">4. Product Information</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content are accurate, complete, reliable, current, or error-free.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">5. Limitation of Liability</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            De Bébé shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our website or products.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-heading font-bold mb-4">6. Changes to Terms</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            We reserve the right to modify these Terms and Conditions at any time. Your continued use of the site following any changes constitutes your acceptance of the new terms.
                        </p>
                    </section>

                    <section className="pt-8 border-t border-secondary">
                        <p className="text-sm text-muted-foreground">
                            If you have any questions about these Terms, please contact us at <span className="text-primary font-bold">legal@debebe.com</span>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
