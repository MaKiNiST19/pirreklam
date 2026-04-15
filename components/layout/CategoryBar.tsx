"use client";

import CategoryBarClient from "./CategoryBarClient";

export type CategoryTreeItem = {
  id: string;
  name: string;
  slug: string;
  children: {
    id: string;
    name: string;
    slug: string;
    children?: { id: string; name: string; slug: string }[];
  }[];
};

interface Props {
  tree?: CategoryTreeItem[];
}

export default function CategoryBar({ tree }: Props) {
  if (!tree || tree.length === 0) return null;
  return <CategoryBarClient tree={tree} />;
}
