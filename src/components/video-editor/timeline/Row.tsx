import { useRow } from "dnd-timeline";
import type { RowDefinition } from "dnd-timeline";
import { ZoomIn, Scissors, MessageSquare, Film } from "lucide-react";

interface RowProps extends RowDefinition {
  children: React.ReactNode;
  variant?: 'video' | 'zoom' | 'trim' | 'annotation';
  label?: string;
}

const variantConfig = {
  video: { 
    bg: 'bg-neutral-800', 
    border: 'border-neutral-700',
    icon: Film,
    iconColor: 'text-neutral-400',
    label: 'Video'
  },
  zoom: { 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200',
    icon: ZoomIn,
    iconColor: 'text-emerald-500',
    label: 'Zoom'
  },
  trim: { 
    bg: 'bg-red-50', 
    border: 'border-red-200',
    icon: Scissors,
    iconColor: 'text-red-400',
    label: 'Trim'
  },
  annotation: { 
    bg: 'bg-amber-50', 
    border: 'border-amber-200',
    icon: MessageSquare,
    iconColor: 'text-amber-500',
    label: 'Annotation'
  },
};

export default function Row({ id, children, variant = 'zoom', label }: RowProps) {
  const { setNodeRef, rowWrapperStyle, rowStyle } = useRow({ id });
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={`border-b ${config.border} ${config.bg} relative`}
      style={{ ...rowWrapperStyle, minHeight: 40, marginBottom: 2 }}
    >
      {/* Row label */}
      <div className="absolute left-0 top-0 bottom-0 w-20 flex items-center gap-1.5 px-2 z-10 pointer-events-none">
        <Icon className={`w-3 h-3 ${config.iconColor}`} />
        <span className={`text-[10px] font-medium ${config.iconColor} uppercase tracking-wide`}>
          {label || config.label}
        </span>
      </div>
      {/* Content area - offset by label width */}
      <div ref={setNodeRef} style={{ ...rowStyle, marginLeft: 80 }}>
        {children}
      </div>
    </div>
  );
}