import React from 'react';
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

export interface OrderingItem {
  id: string;
  text: string;
}

export interface OrderingQuestionProps {
  items: OrderingItem[];
  value?: string[]; // Array of item IDs in chosen order
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export const OrderingQuestion: React.FC<OrderingQuestionProps> = ({
  items,
  value,
  onChange,
  disabled = false,
}) => {
  // Initialize current order with value or default item order
  const currentOrder = value && value.length === items.length
    ? value
    : items.map((i) => i.id);

  const itemMap = React.useMemo(() => {
    const map = new Map<string, OrderingItem>();
    items.forEach((item) => map.set(item.id, item));
    return map;
  }, [items]);

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (disabled || toIdx < 0 || toIdx >= currentOrder.length) return;
    const next = [...currentOrder];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500 font-mono pb-2 border-b border-slate-100">
        <span>Use the Move Up / Move Down buttons to sequence items in the correct order.</span>
        <span className="font-bold text-[#6C4DFF]">{items.length} items to order</span>
      </div>

      <div className="space-y-2.5">
        {currentOrder.map((itemId, idx) => {
          const item = itemMap.get(itemId);
          if (!item) return null;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <GripVertical className="w-4 h-4 text-slate-400 shrink-0 cursor-grab" />
                <span className="w-6 h-6 rounded-md bg-[#2B2350] text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-sm font-medium text-[#0F172A] break-words">
                  {item.text}
                </span>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  aria-label={`Move item ${item.text} up`}
                  className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100"
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || idx === currentOrder.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  aria-label={`Move item ${item.text} down`}
                  className="h-8 w-8 p-0 text-slate-700 hover:bg-slate-100"
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
