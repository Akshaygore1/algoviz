"use client";

import { ProblemCategoryPage } from "@/components/content/ProblemCategoryPage";
import { ARRAYS_HASHING_PROBLEMS } from "@/lib/viz/problems/arraysHashing";

export default ArraysHashingPage;

function ArraysHashingPage() {
  return (
    <ProblemCategoryPage
      title="Arrays & Hashing"
      intro="Nine problems that all rest on one idea: a hash map or set lets you ask 'have I seen this before?' for free, which removes the inner loop from a brute-force scan. Pick a problem, feed it your own input, and step through until the trade is obvious."
      recognise="You are looking at a hashing problem when the brute force is 'for each element, look through the rest', or when the question groups or counts things. Ask what you would need to remember to avoid re-scanning: a set for membership, a map for counts or indexes, a canonical key for grouping."
      mistakes={[
        "Storing values in the map but needing indexes later: decide what the value of each entry is before you start writing.",
        "Adding the current element to the map before checking for its complement, which lets an element pair with itself.",
        "Sorting to compare two collections when counting is linear and simpler to explain.",
        "Restarting the count at every element in Longest Consecutive Sequence instead of only at values with no left neighbour; that quietly becomes O(n²).",
        "Joining strings with a delimiter that can appear inside the data instead of prefixing each string with its length.",
      ]}
      problems={ARRAYS_HASHING_PROBLEMS}
    />
  );
}
