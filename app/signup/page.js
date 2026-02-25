"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Phone, Lock, MapPin, Camera } from "lucide-react";
import axios from "axios";

import { useUserStore } from "@/store/useUserStore";

export default function SignupPage() {
    const setUser = useUserStore((state) => state.setUser);
    const [formData, setFormData] = useState({
        username: "",
        phone: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await axios.post("/api/auth/signup", formData);
            setUser(data.user);
            router.push("/");
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4 py-20">
            <div className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-12 shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading font-black mb-2">Create Account</h1>
                    <p className="text-muted-foreground">Join ሰላም ልብስ family</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username (Name)"
                                required
                                value={formData.username}
                                onChange={handleChange}
                                className="w-full bg-secondary border-none rounded-2xl px-12 py-4 font-bold outline-none focus:ring-2 ring-primary transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number (+251...)"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full bg-secondary border-none rounded-2xl px-12 py-4 font-bold outline-none focus:ring-2 ring-primary transition-all"
                            />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-secondary border-none rounded-2xl px-12 py-4 font-bold outline-none focus:ring-2 ring-primary transition-all"
                            />
                        </div>




                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-5 rounded-2xl text-lg mt-4 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-muted-foreground font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary font-bold hover:underline">
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
}
