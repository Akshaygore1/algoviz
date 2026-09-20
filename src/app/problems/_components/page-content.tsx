"use client";

import { MainPage, type MainPageCard } from "@/components/content/MainPage";

export default ProblemsPage;

const problemCategories: MainPageCard[] = [
  { title: "Arrays & Hashing", href: "/problems/arrays-hashing" },
  { title: "Two Pointers", href: "/problems/two-pointers" },
  { title: "Sliding Window", href: "/problems/sliding-window" },
  { title: "Stack", href: "/problems/stack" },
  { title: "Binary Search", href: "/problems/binary-search" },
  { title: "Linked List", href: "/problems/linked-list" },
];

function ProblemsPage() {
  return (
    <MainPage
      breadcrumb="Interview prep / Problems"
      title="Choose a problem category"
      cards={problemCategories}
    />
  );
}
