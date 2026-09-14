import { VisualizerPage } from "@/components/content/VisualizerPage";
import { HashVisualizer } from "@/components/viz/HashVisualizer";

export default HashingPage;

function HashingPage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Hashing"
      badges={["Data structure", "Beginner", "O(1) average"]}
      title="Hash maps and hash sets"
      intro="A hash map does not search. The key computes its own address: hash the key, jump to that bucket, done. The only complication is that two keys can compute the same address (a collision), which chaining handles by keeping a short list in the bucket."
      interviewNote={{
        heading: "The single most useful interview trade",
        body: "Whenever you catch yourself writing 'for each element, look through the rest', ask what you would need to remember instead. Storing what you have seen in a map usually removes the inner loop entirely: O(n²) time becomes O(n) time plus O(n) memory. Two Sum, contains-duplicate, group-anagrams and subarray-sum-equals-k are all this same trade.",
        to: "/problems",
        linkLabel: "Practise hashing problems →",
      }}
    >
      <HashVisualizer />
    </VisualizerPage>
  );
}
