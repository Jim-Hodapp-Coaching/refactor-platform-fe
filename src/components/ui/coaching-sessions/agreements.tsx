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

import Image from "next/image";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface AgreementsProps {
  /** The current active coaching session Id */
  coachingSessionId: Id;
}

const Agreements: React.FC<{
  coachingSessionId: Id;
  // onChange: (value: string) => void;
  // onKeyDown: () => void;
}> = ({ coachingSessionId /*, onChange, onKeyDown*/ }) => {
  const WAIT_INTERVAL = 1000;
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agreementId, setAgreementId] = useState<Id>("");
  const [agreementBody, setAgreementBody] = useState<string>("");

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

  const handleAgreementSelectionChange = (newValue: string) => {
    console.debug("newValue (hASC): " + newValue);
    setAgreementBody(newValue);
    //setAgreementId();
  };

  const handleAgreementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    console.debug("newValue (hAC): " + newValue);
    setAgreementBody(newValue);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      //onChange(newValue);
    }, WAIT_INTERVAL);

    setTimer(newTimer);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //onKeyDown();
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <div className="flex w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-2 ">
        <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Agreements</CardTitle>
              <CardDescription>
                Manage agreements for this session
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Body</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Last updated
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agreements.map((agreement) => (
                    <TableRow>
                      <TableCell className="font-medium">
                        {agreement.body}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {agreement.created_at.toLocaleString(
                          DateTime.DATETIME_FULL
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {agreement.updated_at.toLocaleString(
                          DateTime.DATETIME_FULL
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                  {agreements.length == 0 && (
                    <TableRow>
                      <div className="py-4 w-32">No agreements</div>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing{" "}
                <strong>
                  {agreements.length > 0 ? <>1 -</> : <></>} {agreements.length}
                </strong>{" "}
                of <strong>{agreements.length}</strong> agreements
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export { Agreements };

// export function Agreements({
//   coachingSessionId: coachingSessionId,
//   ...props
// }: AgreementsProps) {
//   const [agreements, setAgreements] = useState<Agreement[]>([]);

//   useEffect(() => {
//     async function loadAgreements() {
//       if (!coachingSessionId) return;

//       await fetchAgreementsByCoachingSessionId(coachingSessionId)
//         .then((agreements) => {
//           // Apparently it's normal for this to be triggered twice in modern
//           // React versions in strict + development modes
//           // https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
//           console.debug("setAgreements: " + JSON.stringify(agreements));
//           setAgreements(agreements);
//         })
//         .catch(([err]) => {
//           console.error("Failed to fetch Agreements: " + err);
//         });
//     }
//     loadAgreements();
//   }, [coachingSessionId]);

//   return (
//     <div>
//       <div className="grid gap-2">
//         {/* <Label htmlFor="agreements">Agreements</Label> */}
//         <Select
//           defaultValue="0"
//           // value={agreementsId}
//           // onValueChange={setOrganizationId}
//         >
//           <SelectTrigger id="agreement">
//             <SelectValue placeholder="Select agreement" />
//           </SelectTrigger>
//           <SelectContent>
//             {agreements.map((agreement) => (
//               <SelectItem value={agreement.id} key={agreement.id}>
//                 {agreement.body}
//               </SelectItem>
//             ))}
//             {agreements.length == 0 && (
//               <SelectItem disabled={true} value="none">
//                 None found
//               </SelectItem>
//             )}
//           </SelectContent>
//         </Select>
//       </div>
//       <div className="grid gap-2">
//         <textarea></textarea>
//       </div>
//       <div className="grid gap-2">
//         <Button
//           variant="outline"
//           className="w-full"
//           disabled={!coachingSessionId}
//         >
//           <Link href={`/coaching-sessions/${coachingSessionId}`}>
//             Add Agreement
//           </Link>
//         </Button>
//       </div>
//     </div>
//   );
// }
