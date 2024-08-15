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
import { Note, noteToString } from "@/types/note";
import { useAuthStore } from "@/lib/providers/auth-store-provider";
import { Id } from "@/types/general";

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
  const { coachingSessionId } = useAppStateStore((state) => state);

  useEffect(() => {
    async function fetchNote() {
      if (!coachingSessionId) {
        console.error(
          "Failed to fetch Note since coachingSessionId is not set."
        );
        return;
      }

      await fetchNotesByCoachingSessionId(coachingSessionId)
        .then((notes) => {
          const note = notes[0];
          if (notes.length > 0) {
            console.trace("note: " + noteToString(note));
            setNoteId(note.id);
            setNote(note.body);
          } else {
            console.trace("No Notes associated with this coachingSessionId");
          }
        })
        .catch((err) => {
          console.error(
            "Failed to fetch Note for current coaching session: " + err
          );
        });
    }
    fetchNote();
  }, [coachingSessionId, noteId]);

  const handleInputChange = (value: string) => {
    setNote(value);

    if (noteId && coachingSessionId && userId) {
      updateNote(noteId, coachingSessionId, userId, value)
        .then((note) => {
          console.trace("Updated Note: " + noteToString(note));
          setSyncStatus("All changes saved");
        })
        .catch((err) => {
          setSyncStatus("Failed to save changes");
          console.error("Failed to update Note: " + err);
        });
    } else if (!noteId && coachingSessionId && userId) {
      createNote(coachingSessionId, userId, value)
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
        "Could not update or create a Note since coachingSessionId or userId are not set."
      );
    }
  };

  const handleKeyDown = () => {
    setSyncStatus("");
  };

  return (
    <>
      <div className="hidden h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h4 className="w-16 md:w-32 lg:w-48 font-semibold">Session Title</h4>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            <PresetSelector current={current} future={future} past={past} />
            <div className="hidden space-x-2 md:flex">
              <CodeViewer />
              <PresetShare />
            </div>
            <PresetActions />
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col pt-4 px-6">
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
              <Tabs defaultValue="agreements" className="flex-1">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="agreements">Agreements</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                  <TabsTrigger value="program">Program</TabsTrigger>
                </TabsList>
                <TabsContent value="agreements">
                  <div className="bg-gray-500 text-white p-4">Agreements</div>
                </TabsContent>
                <TabsContent value="actions">
                  <div className="bg-red-500 text-white p-4">Actions</div>
                </TabsContent>
                <TabsContent value="program">
                  <div className="bg-blue-500 text-white p-4">Program</div>
                </TabsContent>
              </Tabs>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <div className="flex flex-col">
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="flex-col space-y-4 sm:flex md:order-1">
              <Tabs defaultValue="notes" className="flex-1">
                <TabsList className="grid flex w-96 grid-cols-4 justify-start">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="program">Program</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                  <TabsTrigger value="coachs_notes">
                    <div className="flex gap-2 items-start">
                      <LockClosedIcon className="mt-1" />
                      Coach&#39;s Notes
                    </div>
                  </TabsTrigger>
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
                <TabsContent value="program">
                  <div className="p-4 min-h-[400px] md:min-h-[630px] lg:min-h-[630px] bg-red-500 text-white">
                    Program
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
