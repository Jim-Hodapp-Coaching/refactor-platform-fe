"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchAgreementsByCoachingSessionId } from "@/lib/api/agreements";
import { Agreement } from "@/types/agreement";
import { Id } from "@/types/general";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DateTime } from "ts-luxon";

export interface AgreementsProps {
  /** The current active coaching session Id */
  coachingSessionId: Id;
}

export function Agreements({
  coachingSessionId: coachingSessionId,
  ...props
}: AgreementsProps) {
  const [agreements, setAgreements] = useState<Agreement[]>([]);

  useEffect(() => {
    async function loadAgreements() {
      if (!coachingSessionId) return;

      await fetchAgreementsByCoachingSessionId(coachingSessionId)
        .then((agreements) => {
          // Apparently it's normal for this to be triggered twice in modern
          // React versions in strict + development modes
          // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
          console.debug("setAgreements: " + JSON.stringify(agreements));
          setAgreements(agreements);
        })
        .catch(([err]) => {
          console.error("Failed to fetch Agreements: " + err);
        });
    }
    loadAgreements();
  }, [coachingSessionId]);

  return (
    <div>
      <div className="grid gap-2">
        {/* <Label htmlFor="agreements">Agreements</Label> */}
        <Select
          defaultValue="0"
          // value={agreementsId}
          // onValueChange={setOrganizationId}
        >
          <SelectTrigger id="agreement">
            <SelectValue placeholder="Select agreement" />
          </SelectTrigger>
          <SelectContent>
            {agreements.map((agreement) => (
              <SelectItem value={agreement.id} key={agreement.id}>
                {agreement.body}
              </SelectItem>
            ))}
            {agreements.length == 0 && (
              <SelectItem disabled={true} value="none">
                None found
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <textarea></textarea>
      </div>
      <div className="grid gap-2">
        <Button
          variant="outline"
          className="w-full"
          disabled={!coachingSessionId}
        >
          <Link href={`/coaching-sessions/${coachingSessionId}`}>
            Add Agreement
          </Link>
        </Button>
      </div>
    </div>
  );
}
