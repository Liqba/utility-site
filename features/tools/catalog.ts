export type ToolDefinition = {
  slug: string;
  name: string;
  href: string;
  description: string;
  capabilities: string[];
  kind: "json" | "text" | "diff";
};

export const tools: ToolDefinition[] = [
  {
    slug: "json-editor",
    name: "JSON Editor",
    href: "/json",
    description: "Format, validate, sort, minify, copy, and download JSON without sending it anywhere.",
    capabilities: ["Format", "Validate", "Minify", "Sort keys"],
    kind: "json",
  },
  {
    slug: "text-editor",
    name: "Text Editor",
    href: "/text",
    description: "Write and format Markdown in a clean, distraction-free editor.",
    capabilities: ["Rich text", "Markdown", "Copy", "Download"],
    kind: "text",
  },
  {
    slug: "text-diff",
    name: "Text Diff",
    href: "/diff",
    description: "Compare two texts and see added, removed, and unchanged lines instantly.",
    capabilities: ["Line comparison", "Ignore whitespace", "Swap text"],
    kind: "diff",
  },
];
