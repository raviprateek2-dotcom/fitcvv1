import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface SortableItemProps {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("relative group", className)}>
      <div
        {...attributes}
        {...listeners}
        // Add a touch-action none to prevent scrolling while dragging on touch devices
        className="absolute left-[-16px] xl:left-[-32px] top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing transition-opacity text-muted-foreground hover:text-primary z-10 hidden sm:flex items-center justify-center bg-background/50 backdrop-blur rounded-lg border shadow-sm"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-5 w-5" />
      </div>
      {/* Mobile drag handle in top right */}
      <div
        {...attributes}
        {...listeners}
        className="absolute right-2 top-2 p-2 opacity-100 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-primary z-10 sm:hidden bg-background/50 backdrop-blur rounded-lg border shadow-sm"
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="h-4 w-4" />
      </div>
      {children}
    </div>
  );
}
