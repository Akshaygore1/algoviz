import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClientOnly } from "@/components/ClientOnly";
import { getPattern, patterns } from "@/data/patterns";
import PatternPageContent from "./_components/page-content";

type Props = { params: Promise<{ patternId: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return patterns.map((pattern) => ({ patternId: pattern.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { patternId } = await params;
  const pattern = getPattern(patternId);
  if (!pattern) return { title: "Pattern not found" };
  return {
    title: `${pattern.name}: DSA Interview Pattern`,
    description: pattern.summary,
  };
}

export default async function PatternPage({ params }: Props) {
  const { patternId } = await params;
  const pattern = getPattern(patternId);
  if (!pattern) notFound();

  return (
    <ClientOnly>
      <PatternPageContent patternId={patternId} />
    </ClientOnly>
  );
}
