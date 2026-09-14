import { VisualizerPage } from "@/components/content/VisualizerPage";
import { RecursionVisualizer } from "@/components/viz/RecursionVisualizer";

export default RecursionPage;

function RecursionPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Recursion"
      badges={["Algorithm", "Beginner → Intermediate", "O(n) → O(2ⁿ)"]}
      title="Recursion"
      intro="Recursion is confusing because two things happen at once: calls go down, and answers come back up. Here you can see both: the call stack on the left holds the calls that have started but not finished, and the tree on the right keeps every call that was ever made, with its answer once it returns. Run naive Fibonacci, then the memoized version with the same n, and compare the call counters."
      interviewNote={{
        heading: "What interviewers actually check",
        body: "Three things, in order: does your recursion have a base case that is always reached, does every call work on a strictly smaller input, and can you name the time and space cost, including that the stack itself is space. If you can also spot that the same sub-problem is being solved twice, you have just derived memoization, which is where most dynamic programming answers start.",
        to: "/patterns",
        linkLabel: "See the DFS and DP patterns →",
      }}
    >
      <RecursionVisualizer />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Common mistakes</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              No base case, or a base case the input never hits: the stack grows until it overflows.
            </li>
            <li>
              Recursing on the same size (forgetting the <span className="font-mono">- 1</span> or
              the <span className="font-mono">slice(1)</span>), which never terminates either.
            </li>
            <li>
              Doing work before the recursive call when it belongs after it, or the other way round;
              that choice is exactly the difference between preorder and postorder.
            </li>
            <li>
              Forgetting that the call stack costs memory: an O(n) algorithm with O(n) frames can
              still crash on a huge input.
            </li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">How to read the tree</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A node appears the moment its call starts and shows its return value the moment it
            finishes. A node marked <span className="font-mono">repeat</span> is a sub-problem
            already solved elsewhere in the tree: the wasted work. A node marked{" "}
            <span className="font-mono">memo</span> answered instantly from the cache and has no
            children at all, which is the entire saving made visible.
          </p>
        </div>
      </div>
    </VisualizerPage>
  );
}
