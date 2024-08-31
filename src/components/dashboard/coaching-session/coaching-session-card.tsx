"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Id } from "@/types/general";
import { Select, SelectContent, SelectGroup, SelectLabel, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import LoadedSelect from "@/components/shared/loaded-select";
import { cn } from "@/lib/utils";

export interface CoachingSessionCardProps {
    userId: Id
}

export function CoachingSessionCard({
    userId: userId,
}: CoachingSessionCardProps) {


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
                                />
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </div>
            </CardContent>
        </Card>
    )
}