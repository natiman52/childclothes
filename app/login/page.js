"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Phone, Lock, User } from "lucide-react";
import axios from "axios";


import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
    const setUser = useUserStore((state) => state.setUser);
    const [formData, setFormData] = useState({
        identifier: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const msg = searchParams.get("message");
        if (msg) setMessage(msg);
    }, [searchParams]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const { data } = await axios.post("/api/auth/login", formData);
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            setUser(data.user);
            router.push("/");
            router.refresh();
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-[3rem] p-8 md:p-12 shadow-xl">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-heading font-black mb-2">Welcome Back</h1>
                    <p className="text-muted-foreground">Log in to your account</p>
                </div>

                {message && (
                    <div className="bg-green-50 text-green-600 p-4 rounded-2xl mb-6 text-sm font-medium border border-green-100">
                        {message}
                    </div>
                )}

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
                                name="identifier"
                                placeholder="Phone or Username"
                                required
                                value={formData.identifier}
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
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>

                <div className="mt-8 text-center text-muted-foreground font-medium">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-primary font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}
