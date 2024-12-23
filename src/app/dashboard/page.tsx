import { Metadata } from "next";

import * as React from "react";

import { cn } from "@/lib/utils";

import SelectCoachingSession from "@/components/ui/dashboard/select-coaching-session";

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
  return (
    <div className="items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
      <DashboardContainer>
        <SelectCoachingSession />
      </DashboardContainer>
    </div>
  );
}
