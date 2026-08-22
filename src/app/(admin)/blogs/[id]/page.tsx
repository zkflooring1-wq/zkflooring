"use client";
import { use } from "react";
import BlogEditor from "@/components/editors/BlogEditor";
export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <BlogEditor postId={id} />;
}