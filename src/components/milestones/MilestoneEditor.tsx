"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

type MilestoneEditorProps = {
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  titleError?: string;
  descriptionError?: string;
};

export function MilestoneEditor({
  title,
  description,
  onTitleChange,
  onDescriptionChange,
  titleError,
  descriptionError,
}: MilestoneEditorProps) {
  const [previewTab, setPreviewTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <div className="space-y-1">
        <label className="text-xs font-medium">Title *</label>
        <Input
          placeholder="Deliverable name"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        {titleError && (
          <p className="text-xs text-red-500">{titleError}</p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-xs font-medium">Description</label>
        <div className="flex gap-1 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setPreviewTab("write")}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-t",
              previewTab === "write"
                ? "bg-slate-100 text-foreground border border-slate-200 border-b-0 -mb-px"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setPreviewTab("preview")}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-t",
              previewTab === "preview"
                ? "bg-slate-100 text-foreground border border-slate-200 border-b-0 -mb-px"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Preview
          </button>
        </div>
        {previewTab === "write" ? (
          <textarea
            placeholder="Optional details (Markdown supported)"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            className="flex min-h-[80px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y"
            rows={3}
          />
        ) : (
          <div className="min-h-[80px] w-full rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0">
            {description ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            ) : (
              <span className="text-muted-foreground">Nothing to preview.</span>
            )}
          </div>
        )}
        {descriptionError && (
          <p className="text-xs text-red-500">{descriptionError}</p>
        )}
      </div>
    </div>
  );
}
