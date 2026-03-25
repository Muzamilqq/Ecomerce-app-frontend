import { useState } from "react";
import { X, Search, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAIProducts } from "../../store/slices/productSlice";
import { toggleAIModal } from "../../store/slices/popupSlice";

const AISearchModal = () => {
  const dispatch = useDispatch();
  const { aiSearching } = useSelector((s) => s.product);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    dispatch(fetchAIProducts(prompt)).then((r) => {
      if (!r.error) dispatch(toggleAIModal());
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={() => dispatch(toggleAIModal())}
    >
      <div
        className="glass-panel w-full max-w-lg animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              AI Product Search
            </h2>
          </div>
          <button
            onClick={() => dispatch(toggleAIModal())}
            className="p-1.5 hover:bg-secondary rounded-lg"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Describe what you're looking for in plain language.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            autoFocus
            rows={3}
            placeholder="e.g. I need a gift for my dad who loves cooking, budget $50"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
          <button
            type="submit"
            disabled={aiSearching || !prompt.trim()}
            className="w-full py-3 gradient-primary text-primary-foreground rounded-lg font-semibold text-sm hover:glow-on-hover animate-smooth disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {aiSearching ? (
              <>Searching...</>
            ) : (
              <>
                <Search className="w-4 h-4" /> Search with AI
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AISearchModal;
