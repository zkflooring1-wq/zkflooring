"use client";
import { use } from "react";
import FaqEditor from "@/components/editors/FaqEditor";
export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <FaqEditor faqId={id} />;
}