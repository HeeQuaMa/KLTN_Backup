import { cn } from "@/lib/utils";

interface LineProps {
  className?: string;
}

const Line = ({ className }: LineProps) => {
  return <hr className={cn("h-px w-full border-0 bg-gray-200", className)} />;
};

export default Line;
