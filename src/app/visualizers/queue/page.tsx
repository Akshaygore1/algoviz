import Content from "./_components/page-content";

const TITLE = "Queue Visualizer: Enqueue, Dequeue, Circular Queue, Deque";
const DESCRIPTION =
  "Watch a queue preserve arrival order, see why a circular queue reuses freed slots with modulo arithmetic, and compare it with a double-ended deque.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
