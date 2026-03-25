import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 glass-card hover:glow-on-hover disabled:opacity-40 animate-smooth"
      >
        <ChevronLeft className="w-4 h-4 text-foreground" />
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="w-9 h-9 rounded-lg text-sm text-muted-foreground hover:bg-secondary"
          >
            1
          </button>
          <span className="text-muted-foreground">...</span>
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
            p === currentPage
              ? "gradient-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-secondary"
          }`}
        >
          {p}
        </button>
      ))}

      {end < totalPages && (
        <>
          <span className="text-muted-foreground">...</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className="w-9 h-9 rounded-lg text-sm text-muted-foreground hover:bg-secondary"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 glass-card hover:glow-on-hover disabled:opacity-40 animate-smooth"
      >
        <ChevronRight className="w-4 h-4 text-foreground" />
      </button>
    </div>
  );
};

export default Pagination;
