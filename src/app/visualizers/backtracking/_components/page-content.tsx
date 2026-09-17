import { VisualizerPage } from "@/components/content/VisualizerPage";
import { BacktrackingVisualizer } from "@/components/viz/BacktrackingVisualizer";

export default BacktrackingPage;

function BacktrackingPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Backtracking"
      title="Backtracking"
      intro="Backtracking is depth-first search over decisions. You make one choice, explore everything that follows from it, and then undo it exactly, so the next choice starts from a clean slate. Every example on this page runs that same three-beat rhythm: choose, explore, un-choose. Watch the call stack grow, watch a branch get rejected before it wastes any work, and watch the board return to its previous state on the way back up."
    >
      <BacktrackingVisualizer />

      <div className="mt-10 grid max-w-3xl gap-10 md:grid-cols-2">
        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">The template</h2>
          <p className="mt-4 text-[17px] leading-[27px] text-muted-foreground">
            Almost every backtracking solution is this shape. Once you can see it, the problems stop
            looking different from each other.
          </p>
          <ol className="mt-5 space-y-3 text-[17px] leading-[27px] text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">1. Base case.</span> Is the candidate
              complete? Record it and return.
            </li>
            <li>
              <span className="font-medium text-foreground">2. Prune.</span> Is this branch already
              impossible? Return before recursing.
            </li>
            <li>
              <span className="font-medium text-foreground">3. Choose.</span> Apply one option to
              the partial candidate.
            </li>
            <li>
              <span className="font-medium text-foreground">4. Explore.</span> Recurse on the
              smaller remaining problem.
            </li>
            <li>
              <span className="font-medium text-foreground">5. Un-choose.</span> Undo step 3, byte
              for byte, then try the next option.
            </li>
          </ol>
        </section>
        <section className="border-t border-border pt-8">
          <h2 className="text-xl font-semibold tracking-[-0.02em]">Common mistakes</h2>
          <ul className="mt-5 space-y-3 text-[17px] leading-[27px] text-muted-foreground">
            <li>
              Forgetting to un-choose. The next branch then inherits state it never chose, and the
              answers come out wrong in ways that are hard to read.
            </li>
            <li>
              Recording a reference instead of a copy. Push a copy of the path into the results, or
              every result ends up empty.
            </li>
            <li>
              No visited marking on a grid, so the search walks in circles until the stack
              overflows.
            </li>
            <li>
              Pruning after recursing instead of before. The check is only worth something if it
              stops the call from happening.
            </li>
            <li>
              Producing duplicates: for combinations, pass a start index instead of looping from
              zero every time.
            </li>
          </ul>
        </section>
      </div>
    </VisualizerPage>
  );
}
