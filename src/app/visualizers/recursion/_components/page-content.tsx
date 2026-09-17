import { VisualizerPage } from "@/components/content/VisualizerPage";
import { RecursionVisualizer } from "@/components/viz/RecursionVisualizer";

export default RecursionPage;

function RecursionPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Recursion"
      title="Recursion"
      intro="Recursion is confusing because two things happen at once: calls go down, and answers come back up. Here you can see both: the call stack on the left holds the calls that have started but not finished, and the tree on the right keeps every call that was ever made, with its answer once it returns. Run naive Fibonacci, then the memoized version with the same n, and compare the call counters."
    >
      <RecursionVisualizer />

      <div className="mt-10 grid max-w-3xl gap-10 md:grid-cols-2">
        <section>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Common mistakes</h2>
          <ul className="mt-5 space-y-3 text-[17px] leading-[27px] text-muted-foreground">
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
        </section>
        <section>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">How to read the tree</h2>
          <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
            A node appears the moment its call starts and shows its return value the moment it
            finishes. A node marked <span className="font-mono">repeat</span> is a sub-problem
            already solved elsewhere in the tree: the wasted work. A node marked{" "}
            <span className="font-mono">memo</span> answered instantly from the cache and has no
            children at all, which is the entire saving made visible.
          </p>
        </section>
      </div>
    </VisualizerPage>
  );
}
