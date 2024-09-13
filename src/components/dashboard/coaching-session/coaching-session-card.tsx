"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/types/general";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import LoadedSelect from "@/components/shared/loaded-select";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { CoachingSession } from "@/types/coaching-session";
import { CoachingRelationshipWithUserNames } from "@/types/coaching_relationship_with_user_names";
import { Organization } from "@/types/organization";

export interface CoachingSessionCardProps {
    userId: Id
}

export function CoachingSessionCard({
    userId: userId,
}: CoachingSessionCardProps) {

    const { organizationId, setOrganizationId } = useAppStateStore(
        (state) => state
    );
    const { relationshipId, setRelationshipId } = useAppStateStore(
        (state) => state
    );
    const { coachingSessionId, setCoachingSessionId } = useAppStateStore(
        (state) => state
    );

    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [coachingRelationships, setCoachingRelationships] = useState<
        CoachingRelationshipWithUserNames[]
    >([]);
    const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>(
        []
    );

    useEffect(() => {
        async function loadCoachingRelationships() {
            if (!organizationId) return;
            console.debug("organizationId: " + organizationId);
        }
        loadCoachingRelationships();
    }, [organizationId]);

    function selectOrganization() {
        setOrganizationId(organizationId);
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Join a Coaching Session</CardTitle>
            </CardHeader>
            <CardContent className={cn("grid", "gap-6")}>
                <div className={cn("grid", "gap-2")}>
                    <Select>
                        <SelectTrigger className="w-[180px]" aria-label="Choose Organization">
                            <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Organizations</SelectLabel>
                                <LoadedSelect
                                    url="/organizations"
                                    params={{ userId }}
                                    selectedItem={selectedItem}
                                    onSelectedValue={selectOrganization}
                                />
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {
                    organizationId
                        ?
                        (<div className={cn("grid", "gap-2")}>
                            <Select>
                                <SelectTrigger className="w-[180px]" aria-label="Choose Coaching Relationship">
                                    <SelectValue placeholder="Select Coaching Relationship" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Organizations</SelectLabel>
                                        <LoadedSelect
                                            url="/organizations"
                                            params={{ userId }}
                                            onValueChange={setOrganizationId}
                                        />
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>)
                        :
                        (
                            <div className={cn("grid", "gap-2")}>
                                No organization Found
                            </div>
                        )
                }

            </CardContent>
        </Card>
    )
}