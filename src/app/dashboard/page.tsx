import { Metadata } from "next";

import * as React from "react";

import { cn } from "@/lib/utils";

import { SelectCoachingSession } from "@/components/ui/dashboard/select-coaching-session";
import { useAuthStore } from "@/lib/providers/auth-store-provider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Coaching dashboard",
};

function DashboardContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&>div]:w-full",
        className
      )}
      {...props}
    />
  );
}

export default function DashboardPage() {
  const { userId } = useAuthStore((state) => state);

  return (
    <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
      <DashboardContainer>
        <SelectCoachingSession userId={userId} />
      </DashboardContainer>
    </div>
  );
}
