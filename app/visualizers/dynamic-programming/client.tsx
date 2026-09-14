import { VisualizerPage } from "@/components/app/VisualizerPage";
import { DpVisualizer } from "@/components/viz/DpVisualizer";

export default DpPage;

const STAGE_ROWS = [
  [
    "1. Brute force",
    "Exponential",
    "O(depth) stack",
    "Correct, and unusable. Every sub-problem recomputed.",
  ],
  [
    "2. Repeated work",
    "Exponential",
    "O(depth) stack",
    "Same run, duplicates marked. This is the diagnosis.",
  ],
  [
    "3. Memoization",
    "One call per sub-problem",
    "table + stack",
    "Top-down fix: cache the answer the first time.",
  ],
  [
    "4. Tabulation",
    "One pass per cell",
    "full table",
    "Bottom-up, no recursion, no stack overflow.",
  ],
  [
    "5. Space optimised",
    "Same as tabulation",
    "a row or two",
    "Drop cells the loop can never read again.",
  ],
];

function DpPage() {
  return (
    <VisualizerPage
      breadcrumb="Algorithms / Dynamic Programming"
      badges={["Algorithm", "Intermediate → Advanced", "O(2ⁿ) → O(n)"]}
      title="Dynamic Programming"
      intro="Dynamic programming is not a trick to memorise; it is what happens when you notice that your recursion keeps solving the same sub-problem. So every example here is solved five times: plain recursion, the same recursion with the duplicated calls marked, memoization, a bottom-up table, and finally the version that throws away everything it no longer needs. Keep the input fixed, switch stages, and watch the counters."
      interviewNote={{
        heading: "How to actually answer a DP question",
        body: 'Say the state out loud first: "dp[i] is the best answer using the first i items." Then write the recurrence, then the base cases, then decide whether you want it top-down (memoized recursion, closest to how you thought about it) or bottom-up (a loop, no stack). Only optimise space if you are asked. Interviewers care much more that you can define the state precisely than that you produce the tightest possible code.',
        to: "/patterns",
        linkLabel: "See the DP patterns →",
      }}
    >
      <DpVisualizer />

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-base font-semibold">The five stages side by side</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-xs tracking-wide text-muted-foreground uppercase">
                <th className="py-2 pr-4 font-medium">Stage</th>
                <th className="py-2 pr-4 font-medium">Time</th>
                <th className="py-2 pr-4 font-medium">Space</th>
                <th className="py-2 font-medium">What changes</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              {STAGE_ROWS.map(([stage, time, space, note]) => (
                <tr key={stage} className="border-t border-border">
                  <td className="py-2 pr-4 font-medium text-foreground">{stage}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{time}</td>
                  <td className="py-2 pr-4 font-mono text-xs">{space}</td>
                  <td className="py-2">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The exact costs for the problem you are running are shown in the complexity card, which
          updates with the stage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">How to spot a DP problem</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              It asks for a best, a count, or a yes/no over many choices, not for a position.
            </li>
            <li>
              A greedy choice can be shown to fail, but the answer can be written in terms of the
              answer to a smaller version of the same question.
            </li>
            <li>
              Your first recursive solution has branches that overlap: two different paths ask the
              same sub-question.
            </li>
            <li>The input sizes are small enough that a table of states fits in memory.</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold">Common mistakes</h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-muted-foreground">
            <li>
              A vague state definition. If you cannot finish the sentence “dp[i] is…”, the
              recurrence will be wrong.
            </li>
            <li>
              Filling the table in the wrong order, so a cell reads a neighbour that has not been
              computed yet.
            </li>
            <li>Missing base cases, or an off-by-one between “first i items” and index i.</li>
            <li>
              Optimising space first. Get the full table right, then collapse it: the collapsed
              version is much harder to debug.
            </li>
          </ul>
        </div>
      </div>
    </VisualizerPage>
  );
}
