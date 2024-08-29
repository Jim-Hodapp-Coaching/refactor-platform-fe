"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useRequest, { FetcherResponse } from "@/hooks/use-request";
import { Id } from "@/types/general";
import { Organization } from "@/types/organization";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface CoachingSessionCardProps {
    userId: Id
}

export function CoachingSessionCard({
    userId: userId,
}: CoachingSessionCardProps) {
    const { data: response, error, isLoading, mutate } = useRequest<Organization[]>('/organizations', { userId });

    const { data: organizations } = (response || {}) as FetcherResponse<Organization[]> & { data: Organization[] };
    console.info(organizations);

    const organizationsList = useMemo(() => {
        return (organizations || []).map((organization: Organization) => (
            <SelectItem value={organization.id} key={organization.id}>
                {organization.name}
            </SelectItem>
        ));
    }, [organizations, userId || []]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Join a Coaching Session</CardTitle>
            </CardHeader>
            <CardContent className={cn("grid", "gap-6")}>
                <div className={cn("grid", "gap-2")}>
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading organizations</p>}
                    {!isLoading && !error && (
                        <Select>
                            <SelectTrigger className="w-[180px]" aria-label="Choose Organization">
                                <SelectValue placeholder="Select organization" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Organizations</SelectLabel>
                                    {organizationsList}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}