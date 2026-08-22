"use client";
import { use } from "react";
import ServiceEditor from "@/components/editors/ServiceEditor";
export default function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <ServiceEditor slug={id} />;
}