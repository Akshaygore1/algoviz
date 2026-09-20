import { MainPage, type MainPageCard } from "@/components/content/MainPage";
import { ClientOnly } from "@/components/ClientOnly";
import { patterns } from "@/data/patterns";

const TITLE = "DSA Interview Patterns: Recognise Before You Code";
const DESCRIPTION =
  "The recurring patterns behind coding interviews: hash lookup, frequency maps, two pointers, sliding window, binary search, stacks, graphs and dynamic programming, with recognition cues, templates and pitfalls.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
};

const patternCards: MainPageCard[] = patterns.map((pattern) => ({
  href: `/patterns/${pattern.id}`,
  title: pattern.name,
}));

export default function Page() {
  return (
    <ClientOnly>
      <MainPage
        breadcrumb="Interview prep / Patterns"
        title="Choose a pattern"
        cards={patternCards}
      />
    </ClientOnly>
  );
}
