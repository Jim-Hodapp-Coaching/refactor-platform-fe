"use client";

import { useEffect, useState } from "react";
import { ActionsList } from "@/components/ui/coaching-sessions/actions-list";
import { ItemStatus, Id } from "@/types/general";
import { Action } from "@/types/action";
import { AgreementsList } from "@/components/ui/coaching-sessions/agreements-list";
import { Agreement } from "@/types/agreement";
import {
  createAgreement,
  deleteAgreement,
  updateAgreement,
} from "@/lib/api/agreements";
import { createAction, deleteAction, updateAction } from "@/lib/api/actions";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { DateTime } from "ts-luxon";
import { siteConfig } from "@/site.config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { OverarchingGoalComponent } from "./overarching-goal";
import {
  createOverarchingGoal,
  fetchOverarchingGoalsByCoachingSessionId,
  updateOverarchingGoal,
} from "@/lib/api/overarching-goals";
import {
  defaultOverarchingGoal,
  OverarchingGoal,
  overarchingGoalToString,
} from "@/types/overarching-goal";

const OverarchingGoalContainer: React.FC<{
  userId: Id;
}> = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [goal, setGoal] = useState<OverarchingGoal>(defaultOverarchingGoal());
  const [goalId, setGoalId] = useState<Id>("");
  const { coachingSessionId } = useAppStateStore((state) => state);

  const handleAgreementAdded = (body: string): Promise<Agreement> => {
    // Calls the backend endpoint that creates and stores a full Agreement entity
    return createAgreement(coachingSessionId, userId, body)
      .then((agreement) => {
        return agreement;
      })
      .catch((err) => {
        console.error("Failed to create new Agreement: " + err);
        throw err;
      });
  };

  const handleAgreementEdited = (id: Id, body: string): Promise<Agreement> => {
    return updateAgreement(id, coachingSessionId, userId, body)
      .then((agreement) => {
        return agreement;
      })
      .catch((err) => {
        console.error("Failed to update Agreement (id: " + id + "): " + err);
        throw err;
      });
  };

  const handleAgreementDeleted = (id: Id): Promise<Agreement> => {
    return deleteAgreement(id)
      .then((agreement) => {
        return agreement;
      })
      .catch((err) => {
        console.error("Failed to update Agreement (id: " + id + "): " + err);
        throw err;
      });
  };

  const handleActionAdded = (
    body: string,
    status: ItemStatus,
    dueBy: DateTime
  ): Promise<Action> => {
    // Calls the backend endpoint that creates and stores a full Action entity
    return createAction(coachingSessionId, body, status, dueBy)
      .then((action) => {
        return action;
      })
      .catch((err) => {
        console.error("Failed to create new Action: " + err);
        throw err;
      });
  };

  const handleActionEdited = (
    id: Id,
    body: string,
    status: ItemStatus,
    dueBy: DateTime
  ): Promise<Action> => {
    return updateAction(id, coachingSessionId, body, status, dueBy)
      .then((action) => {
        return action;
      })
      .catch((err) => {
        console.error("Failed to update Action (id: " + id + "): " + err);
        throw err;
      });
  };

  const handleActionDeleted = (id: Id): Promise<Action> => {
    return deleteAction(id)
      .then((action) => {
        return action;
      })
      .catch((err) => {
        console.error("Failed to update Action (id: " + id + "): " + err);
        throw err;
      });
  };

  useEffect(() => {
    async function fetchOverarchingGoal() {
      if (!coachingSessionId) {
        console.error(
          "Failed to fetch Overarching Goal since coachingSessionId is not set."
        );
        return;
      }

      await fetchOverarchingGoalsByCoachingSessionId(coachingSessionId)
        .then((goals) => {
          const goal = goals[0];
          if (goals.length > 0) {
            console.trace("Overarching Goal: " + overarchingGoalToString(goal));
            setGoalId(goal.id);
            setGoal(goal);
          } else {
            console.trace(
              "No Overarching Goals associated with this coachingSessionId"
            );
          }
        })
        .catch((err) => {
          console.error(
            "Failed to fetch Overarching Goal for current coaching session: " +
              err
          );
        });
    }
    fetchOverarchingGoal();
  }, [coachingSessionId]);

  const handleGoalChange = async (newGoal: OverarchingGoal) => {
    console.trace("handleGoalChange (goal to set/update): " + newGoal.title);

    if (goalId && coachingSessionId) {
      console.debug("Update existing Overarching Goal with id: " + goalId);
      updateOverarchingGoal(
        goalId,
        coachingSessionId,
        newGoal.title,
        newGoal.body,
        newGoal.status
      )
        .then((responseGoal) => {
          console.trace(
            "Updated Overarching Goal: " + overarchingGoalToString(responseGoal)
          );
          setGoal(responseGoal);
        })
        .catch((err) => {
          console.error("Failed to update Overarching Goal: " + err);
        });
    } else if (!goalId && coachingSessionId) {
      createOverarchingGoal(
        coachingSessionId,
        newGoal.title,
        newGoal.body,
        newGoal.status
      )
        .then((responseGoal) => {
          console.trace(
            "Newly created Overarching Goal: " +
              overarchingGoalToString(responseGoal)
          );
          setGoal(responseGoal);
          setGoalId(responseGoal.id);
        })
        .catch((err) => {
          console.error("Failed to create new Overarching Goal: " + err);
        });
    } else {
      console.error(
        "Could not update or create a Overarching Goal since coachingSessionId or userId are not set."
      );
    }
  };

  return (
    <div className="grid grid-flow-row auto-rows-min gap-4">
      <div className="row-span-1 pt-4">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2"
        >
          <OverarchingGoalComponent
            initialValue={goal}
            onOpenChange={(open: boolean) => setIsOpen(open)}
            onGoalChange={(goal: OverarchingGoal) => handleGoalChange(goal)}
          ></OverarchingGoalComponent>
          <CollapsibleContent className="px-4">
            <div className="flex-col space-y-4 sm:flex">
              <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                <Tabs defaultValue="agreements">
                  <div className="flex items-center">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="agreements">Agreements</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                      <TabsTrigger value="program" className="hidden">
                        Program
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="agreements">
                    <div className="w-full">
                      <AgreementsList
                        coachingSessionId={coachingSessionId}
                        userId={userId}
                        locale={siteConfig.locale}
                        onAgreementAdded={handleAgreementAdded}
                        onAgreementEdited={handleAgreementEdited}
                        onAgreementDeleted={handleAgreementDeleted}
                      ></AgreementsList>
                    </div>
                  </TabsContent>
                  <TabsContent value="actions">
                    <div className="w-full">
                      <ActionsList
                        coachingSessionId={coachingSessionId}
                        userId={userId}
                        locale={siteConfig.locale}
                        onActionAdded={handleActionAdded}
                        onActionEdited={handleActionEdited}
                        onActionDeleted={handleActionDeleted}
                      ></ActionsList>
                    </div>
                  </TabsContent>
                  <TabsContent value="program">
                    {/* <div className="bg-blue-500 text-white">Program</div> */}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export { OverarchingGoalContainer };
