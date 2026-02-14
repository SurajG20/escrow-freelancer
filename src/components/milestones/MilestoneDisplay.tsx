"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

type MilestoneDisplayProps = {
  title: string;
  description?: string | null;
  className?: string;
};

export function MilestoneDisplay({
  title,
  description,
  className,
}: MilestoneDisplayProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{title}</ReactMarkdown>
      </div>
      {description && (
        <div className="text-sm text-muted-foreground prose prose-sm max-w-none prose-p:my-0 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {description}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
