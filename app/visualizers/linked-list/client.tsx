import { VisualizerPage } from "@/components/app/VisualizerPage";
import { LinkedListVisualizer } from "@/components/viz/LinkedListVisualizer";

export default LinkedListPage;

function LinkedListPage() {
  return (
    <VisualizerPage
      breadcrumb="Learn / Linked Lists"
      badges={["Data structure", "Beginner", "O(1) insert · O(n) access"]}
      title="Linked list operations"
      intro="A linked list trades random access for cheap insertion. There are no indexes (each node only knows the next one), so reaching position k costs k hops, but inserting or deleting once you are there costs two pointer assignments. Pick an operation and watch which links change."
      interviewNote={{
        heading: "What interviewers are really testing",
        body: "Almost every linked list question is a pointer-discipline question: do you keep a prev pointer, do you save next before overwriting it, do you handle the head and empty-list cases. Reverse, find middle and detect cycle cover about 80% of what gets asked, and the last two are both the fast/slow pointer pattern.",
        to: "/patterns",
        linkLabel: "See the pointer patterns →",
      }}
    >
      <LinkedListVisualizer />
    </VisualizerPage>
  );
}
