"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown, Save } from "lucide-react";
import { Id } from "@/types/general";
import {
  createAgreement,
  updateAgreement as updateAgreementApi,
  fetchAgreementsByCoachingSessionId,
} from "@/lib/api/agreements";
import { Agreement, agreementToString } from "@/types/agreement";
import { DateTime } from "ts-luxon";

const AgreementsList: React.FC<{
  coachingSessionId: Id;
  userId: Id;
}> = ({ coachingSessionId, userId }) => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [newAgreement, setNewAgreement] = useState("");
  const [editingId, setEditingId] = useState<Id | null>(null);
  const [editBody, setEditBody] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Agreement>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const addAgreement = () => {
    if (newAgreement.trim() === "") return;

    createAgreement(coachingSessionId, userId, newAgreement)
      .then((agreement) => {
        console.trace(
          "Newly created Agreement: " + agreementToString(agreement)
        );
        setAgreements((prevAgreements) => [
          ...prevAgreements,
          {
            id: agreement.id,
            coaching_session_id: agreement.coaching_session_id,
            body: agreement.body,
            user_id: agreement.user_id,
            created_at: agreement.created_at,
            updated_at: agreement.updated_at,
          },
        ]);
      })
      .catch((err) => {
        console.error("Failed to create new Agreement: " + err);
        throw err;
      });

    setNewAgreement("");
  };

  const updateAgreement = async (id: Id, newBody: string) => {
    try {
      const updatedAgreements = await Promise.all(
        agreements.map(async (agreement) => {
          if (agreement.id === id) {
            // Call the async updateAgreement function
            const updatedAgreement = await updateAgreementApi(
              id,
              agreement.user_id,
              agreement.coaching_session_id,
              newBody
            );

            return {
              ...updatedAgreement,
              body: newBody,
              updated_at: DateTime.now(),
            };
          }
          return agreement;
        })
      );

      setAgreements(updatedAgreements);
      setEditingId(null);
      setEditBody("");
    } catch (err) {
      console.error("Failed to update Agreement:", err);
      throw err;
      // Handle error (e.g., show an error message to the user)
    }
  };

  const deleteAgreement = (id: Id) => {
    setAgreements(agreements.filter((agreement) => agreement.id !== id));
  };

  const sortAgreements = (column: keyof Agreement) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedAgreements = [...agreements].sort((a, b) => {
    const aValue = a[sortColumn as keyof Agreement]!;
    const bValue = b[sortColumn as keyof Agreement]!;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    async function loadAgreements() {
      if (!coachingSessionId) return;

      await fetchAgreementsByCoachingSessionId(coachingSessionId)
        .then((agreements) => {
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
    <div className="flex">
      <div className="bg-inherit rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  onClick={() => sortAgreements("body")}
                  className="cursor-pointer"
                >
                  Agreement <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => sortAgreements("created_at")}
                  className="cursor-pointer hidden md:table-cell"
                >
                  Created At <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead
                  onClick={() => sortAgreements("updated_at")}
                  className="cursor-pointer hidden md:table-cell"
                >
                  Last Updated <ArrowUpDown className="ml-2 h-4 w-4 inline" />
                </TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAgreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell>
                    {editingId === agreement.id ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editBody}
                          onChange={(e) => setEditBody(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            updateAgreement(agreement.id, editBody)
                          }
                          className="flex-grow"
                        />
                        <Button
                          size="sm"
                          onClick={() =>
                            updateAgreement(agreement.id, editBody)
                          }
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      agreement.body
                    )}
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
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setEditingId(agreement.id);
                            setEditBody(agreement.body ?? "");
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteAgreement(agreement.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            value={newAgreement}
            onChange={(e) => setNewAgreement(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addAgreement()}
            placeholder="Enter new agreement"
            className="flex-grow"
          />
          <Button onClick={addAgreement}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export { AgreementsList };
