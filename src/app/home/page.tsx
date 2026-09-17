import { redirect } from "next/navigation";

const TITLE = "Home: DSA Visualizer";
const DESCRIPTION =
  "Choose a section to learn algorithms, explore data structures, recognise interview patterns, or solve problems.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

export default function HomePage() {
  redirect("/");
}
