"use client";

// import { Metadata } from "next";

import * as React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

// import { SelectCoachingSession } from "@/components/ui/dashboard/select-coaching-session";
import { JoinCoachingSession } from "@/components/ui/dashboard/join-coaching-session";
import { useAuthStore } from "@/lib/providers/auth-store-provider";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Coaching dashboard",
// };

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
    <>
      <div className="md:hidden">
        <Image
          src="/examples/cards-light.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="block dark:hidden"
        />
        <Image
          src="/examples/cards-dark.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden items-start justify-center gap-6 rounded-lg p-8 md:grid lg:grid-cols-2 xl:grid-cols-3">
        <DashboardContainer>
          <JoinCoachingSession userId={userId} />
        </DashboardContainer>
      </div>
    </>
  );
}
