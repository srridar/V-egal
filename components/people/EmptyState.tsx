
"use client";

import  Button  from "@/components/ui/Button";
import { Users } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

const EmptyState = ({
  title,
  description,
  buttonText,
  icon,
  onClick,
}: EmptyStateProps) => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-dashed bg-black p-8 text-center">
      <div className="mb-5 rounded-full bg-primary/10 p-5 text-primary">
        {icon ?? <Users className="h-10 w-10" />}
      </div>

      <h2 className="text-xl font-semibold">{title}</h2>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      {buttonText && (
        <Button className="mt-6" onClick={onClick}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;