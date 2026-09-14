import { VisualizerPage } from "@/components/content/VisualizerPage";
import { BacktrackingVisualizer } from "@/components/viz/BacktrackingVisualizer";

export default BacktrackingPage;

function BacktrackingPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Backtracking"
      badges={["Algorithm", "Intermediate", "O(branchingᵈᵉᵖᵗʰ)"]}
      title="Backtracking"
      intro="Backtracking is depth-first search over decisions. You make one choice, explore everything that follows from it, and then undo it exactly, so the next choice starts from a clean slate. Every example on this page runs that same three-beat rhythm: choose, explore, un-choose. Watch the call stack grow, watch a branch get rejected before it wastes any work, and watch the board return to its previous state on the way back up."
      interviewNote={{
        heading: "Answering a backtracking question",
        body: "State the three pieces before writing code: what one decision is, when you stop (a complete candidate, or an impossible one), and what you must undo after recursing. Then say out loud where you prune: a branch rejected early is worth more than any micro-optimisation. If the interviewer asks about complexity, describe the shape of the tree (branching factor to the power of the depth) rather than reaching for a single formula.",
        to: "/patterns",
        linkLabel: "See the interview patterns →",
      }}
    >
      <BacktrackingVisualizer />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">The template</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Almost every backtracking solution is this shape. Once you can see it, the problems stop
            looking different from each other.
          </p>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
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
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Common mistakes</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
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
        </div>
      </div>
    </VisualizerPage>
  );
}
