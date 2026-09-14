import Content from "./_components/page-content";

const TITLE = "Linked List Visualizer: Insert, Delete, Reverse, Cycle Detection";
const DESCRIPTION =
  "Step through every linked list operation: insert at head, tail or position, delete, search, reverse with three pointers, find the middle, detect a cycle and merge two sorted lists.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
