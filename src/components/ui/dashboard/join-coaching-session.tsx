import React, { useState } from 'react';
import { Id } from "@/types/general";
import { SelectCoachingSession } from './select-coaching-session';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface CoachingSessionCardProps {
    userId: Id;
}

export function JoinCoachingSession({ userId: userId }: CoachingSessionCardProps) {
    const [firstSelection, setFirstSelection] = useState<string | null>(null)
    const [secondSelection, setSecondSelection] = useState<string | null>(null)

    const handleFirstSelection = (value: string) => {
        setFirstSelection(value)
        setSecondSelection(null) // Reset second selection when first changes
    }

    const handleSecondSelection = (value: string) => {
        setSecondSelection(value)
    }

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle>Make Your Selection</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <SelectCoachingSession
                        url="/organizations"
                        params={{ userId }}
                        onChange={handleFirstSelection}
                        placeholder="Select first option"
                    />
                    {firstSelection && (
                        <SelectCoachingSession
                            url="/organizations"
                            params={{ firstSelection }}
                            onChange={handleSecondSelection}
                            placeholder="Select second option"
                        />
                    )}
                    {secondSelection && (
                        <p className="text-sm font-medium">
                            You selected: {firstSelection} and {secondSelection}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}