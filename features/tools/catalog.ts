export type ToolDefinition = {
  slug: string;
  name: string;
  href: string;
  description: string;
  capabilities: string[];
};

export const tools: ToolDefinition[] = [
  {
    slug: "json-editor",
    name: "JSON Editor",
    href: "/json",
    description: "Format, validate, sort, minify, copy, and download JSON without sending it anywhere.",
    capabilities: ["Format", "Validate", "Minify", "Sort keys"],
  },
];
