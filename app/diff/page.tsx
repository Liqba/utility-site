import type { Metadata } from "next";
import { TextDiff } from "@/features/text-diff/components/text-diff";

export const metadata: Metadata = {
  title: "Text Diff",
  description: "Compare two texts and inspect changed lines in your browser.",
};

export default function TextDiffPage() {
  return <TextDiff />;
}
