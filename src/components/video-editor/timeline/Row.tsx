import { useRow } from "dnd-timeline";
import type { RowDefinition } from "dnd-timeline";

interface RowProps extends RowDefinition {
  children: React.ReactNode;
}

export default function Row({ id, children }: RowProps) {
  const { setNodeRef, rowWrapperStyle, rowStyle } = useRow({ id });

  return (
    <div
      className="border-b border-neutral-200 bg-neutral-100"
      style={{ ...rowWrapperStyle, minHeight: 48, marginBottom: 4 }}
    >
      <div ref={setNodeRef} style={rowStyle}>
        {children}
      </div>
    </div>
  );
}