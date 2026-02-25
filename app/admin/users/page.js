"use client";

import { useState } from "react";
import { MoreVertical, Search, Filter, ShieldAlert, Key } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";
import Pagination from "@/components/Pagination";

export default function AdminUsersPage() {
    const router = useRouter();
    const [page, setPage] = useState(1);

    const { data: userData = { data: [], total: 0, pages: 0 }, isLoading } = useQuery({
        queryKey: ["admin-users", page],
        queryFn: async () => {
            const { data } = await api.get(`/admin/users?page=${page}`);
            return data;
        }
    });

    const users = userData.data;

    if (isLoading) return <LoadingSpinner />;
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border pb-6">
                <h1 className="text-3xl font-heading font-black">Users Management</h1>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input type="text" placeholder="Search users by name or phone..." className="w-full bg-white border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 ring-primary" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-secondary/50 text-muted-foreground text-sm border-b border-border">
                                <th className="p-4 font-bold">User</th>
                                <th className="p-4 font-bold">Joined</th>
                                <th className="p-4 font-bold text-center">Orders</th>
                                <th className="p-4 font-bold">Total Spent</th>
                                <th className="p-4 font-bold">Role</th>
                                <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm font-medium">
                            {users.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-muted-foreground">No users found.</td></tr>
                            ) : users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer"
                                    onClick={() => router.push(`/admin/users/${user.id}`)}
                                >
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary font-bold overflow-hidden relative">
                                                {user.photo ? (
                                                    <Image src={user.photo} alt={user.username} fill className="object-cover" />
                                                ) : (
                                                    user.username.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{user.username}</p>
                                                <p className="text-xs text-muted-foreground">{user.phone}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-muted-foreground">{new Date(user.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4 font-bold text-center">{user._count?.orders || 0}</td>
                                    <td className="p-4 font-bold">ETB {Number(user.totalSpent).toFixed(2) || "0.00"}</td>
                                    <td className="p-4">
                                        <div className="flex flex-col gap-1 items-start">
                                            <span className="px-3 py-1 bg-secondary rounded-full text-xs font-bold text-foreground capitalize">
                                                {user.role}
                                            </span>
                                            {user.role === 'BANNED' && (
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                                    Banned
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="p-2 text-muted-foreground hover:text-primary bg-secondary/50 hover:bg-secondary rounded-lg transition-colors"
                                                title="Reset Password"
                                            >
                                                <Key size={16} />
                                            </button>
                                            <button
                                                className="p-2 text-muted-foreground hover:text-red-600 bg-secondary/50 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Ban User"
                                            >
                                                <ShieldAlert size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-border flex justify-between items-center text-sm text-muted-foreground font-bold">
                    <span>Showing {users.length} of {userData.total} entries</span>
                </div>
            </div>

            <Pagination
                currentPage={userData.page || 1}
                totalPages={userData.pages || 1}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
            />
        </div>
    );
}
