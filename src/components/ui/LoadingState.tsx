import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({
  message = "Loading...",
}: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <Loader2 className="w-8 h-8 text-gold-400 animate-spin mb-4" />
      <p className="text-sm text-obsidian-400">{message}</p>
    </div>
  );
}