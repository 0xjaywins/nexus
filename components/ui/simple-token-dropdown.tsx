"use client";
import { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { TokenIcon } from "../../components/ui/token-icon";
import { tokens, type Token } from "../../config/tokens";

interface SimpleTokenDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
  excludeTokens?: string[];
  label?: string;
  className?: string;
}

export function SimpleTokenDropdown({
  value,
  onValueChange,
  excludeTokens = [],
  label = "Select token",
  className,
}: SimpleTokenDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  // Filter out excluded tokens
  const availableTokens = Object.values(tokens).filter(
    (token) => !excludeTokens.includes(token.symbol)
  );

  // Update selected token when value changes
  useEffect(() => {
    if (value) {
      const token = tokens[value];
      if (token) setSelectedToken(token);
    } else {
      setSelectedToken(null);
    }
  }, [value]);

  // Handle token selection
  const handleSelect = (tokenSymbol: string) => {
    const token = tokens[tokenSymbol];
    setSelectedToken(token);
    onValueChange?.(tokenSymbol);
    setOpen(false);
  };

  return (
    <div className={className}>
      <Button
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "w-full justify-between border-white/20 bg-void/50 hover:bg-void/80 hover:text-white",
          "focus:ring-1 focus:ring-neon-cyan"
        )}
        onClick={() => setOpen(!open)}
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <TokenIcon symbol={selectedToken.symbol} size="sm" />
            <span className="text-xs text-text-secondary">
              {selectedToken.symbol}
            </span>
          </div>
        ) : (
          <span className="text-text-secondary">{label}</span>
        )}
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50 text-text-secondary" />
      </Button>

      {open && (
        <div className="absolute z-50 mt-1 w-[200px] p-0 bg-void border border-white/20 rounded-md shadow-lg">
          <div className="p-2">
            <input
              className="w-full p-2 bg-void/50 border border-white/10 rounded-md text-white placeholder-text-secondary focus:outline-none focus:ring-1 focus:ring-neon-cyan"
              placeholder="Search token..."
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {availableTokens.length === 0 ? (
              <div className="py-2 text-center text-sm text-text-secondary">
                No token found.
              </div>
            ) : (
              availableTokens.map((token) => (
                <div
                  key={token.symbol}
                  onClick={() => handleSelect(token.symbol)}
                  className="flex items-center gap-2 py-2 px-2 cursor-pointer hover:bg-white/5"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <TokenIcon symbol={token.symbol} size="sm" />
                    <div className="flex flex-col">
                      <span className="text-xs text-text-primary">
                        {token.name}
                      </span>
                      <span className="text-xs text-text-secondary">
                        {token.symbol}
                      </span>
                    </div>
                  </div>
                  {selectedToken?.symbol === token.symbol && (
                    <Check className="h-4 w-4 text-neon-cyan" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
