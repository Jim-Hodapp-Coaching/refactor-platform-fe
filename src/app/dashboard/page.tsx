"use client";

// import { Metadata } from "next";

import * as React from "react";

import Image from "next/image";

import { cn } from "@/lib/utils";

import { DemoCookieSettings } from "@/components/ui/dashboard/cookie-settings";
// import { DemoCreateAccount } from "@/components/ui/dashboard/create-account";
// import { DemoDatePicker } from "@/components/ui/dashboard/date-picker";
// import { DemoGithub } from "@/components/ui/dashboard/github-card";
// import { DemoNotifications } from "@/components/ui/dashboard/notifications";
// import { DemoPaymentMethod } from "@/components/ui/dashboard/payment-method";
import { SelectOrganizationRelationship } from "@/components/ui/dashboard/select-organization-relationship";
import { useEffect, useState } from "react";
import { Organization } from "@/types/organization";
import { fetchOrganizationsByUserId } from "@/lib/api/organizations";
import { useAuthStore } from "@/lib/providers/auth-store-provider";
// import { DemoShareDocument } from "@/components/ui/dashboard/share-document";
// import { DemoTeamMembers } from "@/components/ui/dashboard/team-members";

// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Coaching dashboard",
// };

function DemoContainer({
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
  const { userUUID } = useAuthStore((state) => state);

  const [organizations, setOrganizations] = useState<Organization[] | null>(
    null
  );
  useEffect(() => {
    async function loadOrganizations() {
      const fetchedOrganizations = await fetchOrganizationsByUserId(userUUID);
      console.debug(
        "Organizations: " + JSON.stringify(fetchedOrganizations[0])
      );
      setOrganizations(fetchedOrganizations[0]);
    }
    loadOrganizations();
  }, []);

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
        {/* <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
          <DemoContainer>
          <DemoCreateAccount />
        </DemoContainer>
        <DemoContainer>
          <DemoPaymentMethod />
        </DemoContainer>
      </div>
      <div className="col-span-2 grid items-start gap-6 lg:col-span-1">
        <DemoContainer>
          <DemoTeamMembers />
        </DemoContainer>
        <DemoContainer>
          <DemoShareDocument />
        </DemoContainer>
        <DemoContainer>
          <DemoDatePicker />
        </DemoContainer>
        <DemoContainer>
          <DemoNotifications />
        </DemoContainer>
      </div>
      <div className="col-span-2 grid items-start gap-6 lg:col-span-2 lg:grid-cols-2 xl:col-span-1 xl:grid-cols-1">
        <DemoContainer>
          <DemoGithub />
        </DemoContainer> */}
        <DemoContainer>
          <SelectOrganizationRelationship userUUID={userUUID} />
        </DemoContainer>
        <DemoContainer>
          <DemoCookieSettings />
        </DemoContainer>
        {/* </div> */}
      </div>
    </>
  );
}
