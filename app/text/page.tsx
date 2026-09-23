import type { Metadata } from "next";
import { TextEditor } from "@/features/text-editor/components/text-editor";

export const metadata: Metadata = {
  title: "Text Editor",
  description: "Write and format Markdown in your browser with Milkdown.",
};

export default function TextEditorPage() {
  return <TextEditor />;
}
