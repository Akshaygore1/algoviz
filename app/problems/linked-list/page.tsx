import Content from "./client";

const TITLE = "Linked List Interview Problems Visualized: 11 Problems";
const DESCRIPTION =
  "Step through Reverse Linked List, Merge Two Sorted Lists, Reorder List, Remove Nth From End, Copy List with Random Pointer, Add Two Numbers, cycle detection, LRU Cache, Merge K Sorted Lists and Reverse Nodes in K-Group.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
