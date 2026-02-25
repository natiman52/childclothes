import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-border bg-white text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1">
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white border border-border text-muted-foreground hover:bg-secondary"
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-border bg-white text-muted-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
