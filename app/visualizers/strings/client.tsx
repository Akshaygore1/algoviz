import { VisualizerPage } from "@/components/app/VisualizerPage";
import { StringVisualizer } from "@/components/viz/StringVisualizer";

export default StringsPage;

function StringsPage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Strings"
      badges={["Data structure", "Beginner", "O(n) patterns"]}
      title="String algorithms"
      intro="A string is an array of characters, so every array technique applies, but three of them cover most string interview questions: counting with a map, walking inwards with two pointers, and sliding a window. Watch each one character by character."
      interviewNote={{
        heading: "The three tools that answer most string questions",
        body: "Counting characters (anagrams, permutations, most frequent), two pointers from both ends (palindromes, reversing, valid checks), and a sliding window (longest or shortest substring with a property). If a solution feels like it needs nested loops over substrings, it is almost always a window problem in disguise.",
        to: "/patterns",
        linkLabel: "See the sliding window pattern →",
      }}
    >
      <StringVisualizer />
    </VisualizerPage>
  );
}
