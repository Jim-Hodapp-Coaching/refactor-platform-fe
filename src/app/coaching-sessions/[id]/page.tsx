"use client";

// import { Metadata } from "next";

import * as React from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { ChevronUp, ChevronDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { LockClosedIcon } from "@radix-ui/react-icons";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CodeViewer } from "@/components/ui/code-viewer";
import { MaxLengthSelector } from "@/components/ui/maxlength-selector";
import { ModelSelector } from "@/components/ui/model-selector";
import { PresetActions } from "@/components/ui/preset-actions";
import { PresetSelector } from "@/components/ui/preset-selector";
import { PresetShare } from "@/components/ui/preset-share";
import { TemperatureSelector } from "@/components/ui/temperature-selector";
import { TopPSelector } from "@/components/ui/top-p-selector";
import { cn } from "@/lib/utils";
import { models, types } from "@/data/models";
import { current, future, past } from "@/data/presets";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { useEffect, useState } from "react";
import {
  createNote,
  fetchNotesByCoachingSessionId,
  updateNote,
} from "@/lib/api/notes";
import { noteToString } from "@/types/note";
import { useAuthStore } from "@/lib/providers/auth-store-provider";
import { ActionStatus, Id } from "@/types/general";
import { AgreementsList } from "@/components/ui/coaching-sessions/agreements-list";
import { Agreement } from "@/types/agreement";
import {
  createAgreement,
  deleteAgreement,
  updateAgreement,
} from "@/lib/api/agreements";
import { siteConfig } from "@/site.config";
import { ActionsList } from "@/components/ui/coaching-sessions/actions-list";
import { Action } from "@/types/action";
import { createAction, deleteAction, updateAction } from "@/lib/api/actions";
import { DateTime } from "ts-luxon";
import { CoachingSessionTitle } from "@/components/ui/coaching-sessions/coaching-session-title";
import { SessionTitle, SessionTitleStyle } from "@/types/session-title";

// export const metadata: Metadata = {
//   title: "Coaching Session",
//   description: "Coaching session main page, where the good stuff happens.",
// };

export default function CoachingSessionsPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [noteId, setNoteId] = useState<Id>("");
  const [note, setNote] = useState<string>("");
  const [syncStatus, setSyncStatus] = useState<string>("");
  const { userId } = useAuthStore((state) => state);
  const { coachingSession, coachingRelationship } = useAppStateStore(
    (state) => state
  );

  useEffect(() => {
    async function fetchNote() {
      if (!coachingSession.id) {
        console.error(
          "Failed to fetch Note since coachingSession.id is not set."
        );
        return;
      }

      await fetchNotesByCoachingSessionId(coachingSession.id)
        .then((notes) => {
          const note = notes[0];
          if (notes.length > 0) {
            console.trace("note: " + noteToString(note));
            setNoteId(note.id);
            setNote(note.body);
          } else {
            console.trace("No Notes associated with this coachingSession.id");
          }
        })
        .catch((err) => {
          console.error(
            "Failed to fetch Note for current coaching session: " + err
          );
        });
    }
    fetchNote();
  }, [coachingSession.id, noteId]);

  const handleAgreementAdded = (body: string): Promise<Agreement> => {
    // Calls the backend endpoint that creates and stores a full Agreement entity
    return createAgreement(coachingSession.id, userId, body)
      .then((agreement) => {
        return agreement;
      })
      .catch((err) => {
        console.error("Failed to create new Agreement: " + err);
        throw err;
      });
  };

  const handleAgreementEdited = (id: Id, body: string): Promise<Agreement> => {
    return updateAgreement(id, coachingSession.id, userId, body)
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
    status: ActionStatus,
    dueBy: DateTime
  ): Promise<Action> => {
    // Calls the backend endpoint that creates and stores a full Action entity
    return createAction(coachingSession.id, body, status, dueBy)
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
    status: ActionStatus,
    dueBy: DateTime
  ): Promise<Action> => {
    return updateAction(id, coachingSession.id, body, status, dueBy)
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

  const handleInputChange = (value: string) => {
    setNote(value);

    if (noteId && coachingSession.id && userId) {
      updateNote(noteId, coachingSession.id, userId, value)
        .then((note) => {
          console.trace("Updated Note: " + noteToString(note));
          setSyncStatus("All changes saved");
        })
        .catch((err) => {
          setSyncStatus("Failed to save changes");
          console.error("Failed to update Note: " + err);
        });
    } else if (!noteId && coachingSession.id && userId) {
      createNote(coachingSession.id, userId, value)
        .then((note) => {
          console.trace("Newly created Note: " + noteToString(note));
          setNoteId(note.id);
          setSyncStatus("All changes saved");
        })
        .catch((err) => {
          setSyncStatus("Failed to save changes");
          console.error("Failed to create new Note: " + err);
        });
    } else {
      console.error(
        "Could not update or create a Note since coachingSession.id or userId are not set."
      );
    }
  };

  const handleKeyDown = () => {
    setSyncStatus("");
  };

  const handleTitleRender = (sessionTitle: string) => {
    document.title = sessionTitle;
  };

  return (
    <>
      <div className="h-full flex-col md:flex">
        <div className="flex flex-col items-start justify-between space-y-2 py-4 px-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <CoachingSessionTitle
            coachingSession={coachingSession}
            coachingRelationship={coachingRelationship}
            locale={siteConfig.locale}
            style={siteConfig.titleStyle}
            onRender={handleTitleRender}
          ></CoachingSessionTitle>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector current={current} future={future} past={past} />
            <PresetActions />
          </div>
        </div>
      </div>

      <Separator />

      <div className="grid grid-flow-row auto-rows-min gap-4">
        <div className="row-span-1 pt-4">
          <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full space-y-2"
          >
            <div className="flex items-center justify-between space-x-4 px-4">
              <Button
                variant="outline"
                className={cn(
                  "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted text-sm font-semibold text-muted-foreground shadow-inner"
                )}
                onClick={() => setIsOpen(!isOpen)}
              >
                <span className="hidden md:inline-flex md:inline-flex">
                  Overarching goal: to achieve...
                </span>
                <span className="inline-flex md:hidden">Goal...</span>
                <div className="ml-auto flex w-full space-x-2 justify-end">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {/* FIXME: causes a React hydration error to put a checkbox here, not sure why */}
                          {/* <Checkbox id="oa_achieved" /> */}
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-normal">Achieved?</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <span>
                    {!isOpen && <ChevronDown className="h-4 w-4" />}
                    {isOpen && <ChevronUp className="h-4 w-4" />}
                  </span>
                </div>
              </Button>
              {/* <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="w-9 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger> */}
            </div>
            <CollapsibleContent className="px-4">
              <div className="flex-col space-y-4 sm:flex">
                <div className="grid flex-1 items-start gap-4 sm:py-0 md:gap-8">
                  <Tabs defaultValue="agreements">
                    <div className="flex items-center">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="agreements">Agreements</TabsTrigger>
                        <TabsTrigger value="actions">Actions</TabsTrigger>
                        <TabsTrigger value="program">Program</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="agreements">
                      <div className="w-full">
                        <AgreementsList
                          coachingSessionId={coachingSession.id}
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
                          coachingSessionId={coachingSession.id}
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

        <div className="row-span-1 h-full py-4 px-4">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="flex-col space-y-4 sm:flex md:order-1">
              <Tabs defaultValue="notes" className="flex-1">
                <TabsList className="grid flex w-128 grid-cols-2 justify-start">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                  {/* <TabsTrigger value="coachs_notes">
                    <div className="flex gap-2 items-start">
                      <LockClosedIcon className="mt-1" />
                      Coach&#39;s Notes
                    </div>
                  </TabsTrigger> */}
                </TabsList>
                <TabsContent value="notes">
                  <div className="flex h-full flex-col space-y-4">
                    <CoachingNotes
                      value={note}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                    ></CoachingNotes>
                    <p className="text-sm text-muted-foreground">
                      {syncStatus}
                    </p>
                  </div>
                </TabsContent>
                <TabsContent value="console">
                  <div className="p-4 min-h-[400px] md:min-h-[630px] lg:min-h-[630px] bg-blue-500 text-white">
                    Console
                  </div>
                </TabsContent>
                <TabsContent value="coachs_notes">
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Coach's notes"
                      className="p-4 min-h-[400px] md:min-h-[630px] lg:min-h-[630px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex-col space-y-4 sm:flex md:order-2">
              <ModelSelector types={types} models={models} />
              <TemperatureSelector defaultValue={[0.56]} />
              <MaxLengthSelector defaultValue={[256]} />
              <TopPSelector defaultValue={[0.9]} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// A debounced input CoachingNotes textarea component
// TODO: move this into the components dir
const CoachingNotes: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onKeyDown: () => void;
}> = ({ value, onChange, onKeyDown }) => {
  const WAIT_INTERVAL = 1000;
  const [timer, setTimer] = useState<number | undefined>(undefined);
  const [note, setNote] = useState<string>(value);

  // Make sure the internal value prop updates when the component interface's
  // value prop changes.
  useEffect(() => {
    setNote(value);
  }, [value]);

  const handleSessionNoteChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newValue = e.target.value;
    setNote(newValue);

    if (timer) {
      clearTimeout(timer);
    }

    const newTimer = window.setTimeout(() => {
      onChange(newValue);
    }, WAIT_INTERVAL);

    setTimer(newTimer);
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown();
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <Textarea
      placeholder="Session notes"
      value={note}
      className="p-4 min-h-[400px] md:min-h-[630px] lg:min-h-[630px]"
      onChange={handleSessionNoteChange}
      onKeyDown={handleOnKeyDown}
    />
  );
};
