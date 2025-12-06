import * as React from "react";
import { cn } from "@/lib/utils";

type PageProps = React.PropsWithChildren<{
  className?: string;
}>;

export default function Page({ className, children }: PageProps) {
  return <div className={cn("space-y-6", className)}>{children}</div>;
}
