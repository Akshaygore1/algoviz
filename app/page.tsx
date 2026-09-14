import Content from "./client";

const TITLE = "DSA Visualizer: See how algorithms actually work";
const DESCRIPTION =
  "Learn data structures and algorithms through step-by-step interactive visualizations, master the patterns behind coding interviews, and track your interview readiness.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function Page() {
  return <Content />;
}
