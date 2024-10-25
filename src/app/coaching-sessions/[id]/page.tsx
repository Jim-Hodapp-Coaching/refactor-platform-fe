"use client";

// import { Metadata } from "next";

import * as React from "react";

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { PresetActions } from "@/components/ui/preset-actions";
import { useAppStateStore } from "@/lib/providers/app-state-store-provider";
import { useEffect, useRef, useState } from "react";
import {
  createNote,
  fetchNotesByCoachingSessionId,
  updateNote,
} from "@/lib/api/notes";
import { defaultNote, Note, noteToString } from "@/types/note";
import { useAuthStore } from "@/lib/providers/auth-store-provider";

import { siteConfig } from "@/site.config";
import { CoachingSessionTitle } from "@/components/ui/coaching-sessions/coaching-session-title";
import { OverarchingGoalContainer } from "@/components/ui/coaching-sessions/overarching-goal-container";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { LockClosedIcon, SymbolIcon } from "@radix-ui/react-icons";
import { DynamicApiSelect } from "@/components/ui/dashboard/dynamic-api-select";
import { DateTime } from "ts-luxon";
import { CoachingSession } from "@/types/coaching-session";

// export const metadata: Metadata = {
//   title: "Coaching Session",
//   description: "Coaching session main page, where the good stuff happens.",
// };

export default function CoachingSessionsPage() {
  const [note, setNote] = useState<Note>(defaultNote());
  const [syncStatus, setSyncStatus] = useState<string>("");
  const { userId } = useAuthStore((state) => ({ userId: state.userId }));
  const { coachingSessionId, relationshipId } = useAppStateStore(
    (state) => state
  );

  //@TODO: create a shared static function for this.
  const FROM_DATE = DateTime.now().minus({ month: 1 }).toISODate();
  const TO_DATE = DateTime.now().plus({ month: 1 }).toISODate();

  async function fetchNote() {
    if (!coachingSessionId) {
      console.error("Failed to fetch Note since coachingSessionId is not set.");
      return;
    }
    if (isLoading) {
      console.debug(
        "Not issuing a new Note fetch because a previous fetch is still in progress."
      );
    }

    setIsLoading(true);

    await fetchNotesByCoachingSessionId(coachingSessionId)
      .then((notes) => {
        const note = notes[0];
        if (notes.length > 0) {
          console.trace("Fetched note: " + noteToString(note));
          setEditorContent(note.body);
          setNote(note);
          setSyncStatus("Notes refreshed");
          setEditorFocussed();
        } else {
          console.trace("No Notes associated with this coachingSessionId");
        }
      })
      .catch((err) => {
        console.error(
          "Failed to fetch Note for current coaching session id: " +
            coachingSession.id +
            ". Error: " +
            err
        );
      });

    setIsLoading(false);
  }

  useEffect(() => {
    fetchNote();
  }, [coachingSessionId, noteId]);

  const setEditorFocussed = () => {
    editorRef.current?.setFocussed();
  };

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

  const handleTitleRender = (sessionTitle: string) => {
    document.title = sessionTitle;
  };

  const handleSessionSelection = (value: string) => {
    // console.log("Selected new session: " + value);
    fetchNote();
  };

  return (
    <div className="max-w-screen-2xl">
      <div className="flex-col h-full md:flex ">
        <div className="flex flex-col items-start justify-between space-y-2 py-4 px-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <CoachingSessionTitle
            locale={siteConfig.locale}
            style={siteConfig.titleStyle}
            onRender={handleTitleRender}
          ></CoachingSessionTitle>
          <div className="ml-auto flex w-full space-x-2 sm:justify-end">
            {/* <PresetSelector current={current} future={future} past={past} /> */}
            {relationshipId && (
              <div className="grid gap-2">
                <DynamicApiSelect<CoachingSession>
                  url="/coaching_sessions"
                  params={{
                    coaching_relationship_id: relationshipId,
                    from_date: FROM_DATE,
                    to_Date: TO_DATE,
                  }}
                  onChange={handleSessionSelection}
                  placeholder="Select coaching session"
                  getOptionLabel={(session) => session.date.toString()}
                  getOptionValue={(session) => session.id.toString()}
                  elementId="session-selector"
                  groupByDate={true}
                />
              </div>
            )}
            {/* Hidden for MVP */}
            <div className="hidden">
              <PresetActions />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <OverarchingGoalContainer userId={userId} />

      <div className="row-span-1 h-full py-4 px-4">
        <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
          <div className="flex-col space-y-4 sm:flex md:order-1">
            <Tabs defaultValue="notes" className="flex-1">
              <TabsList className="grid w-128 grid-cols-2 justify-start">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="console" className="hidden">
                  Console
                </TabsTrigger>
                <TabsTrigger value="coachs_notes" className="hidden">
                  <div className="flex gap-2 items-start">
                    <LockClosedIcon className="mt-1" />
                    Coach&#39;s Notes
                  </div>
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notes">
                <div className="flex-col h-full space-y-4">
                  <CoachingNotes
                    ref={editorRef}
                    value={note.body}
                    onChange={handleOnChange}
                    onKeyDown={handleKeyDown}
                  ></CoachingNotes>
                  <p className="text-sm text-muted-foreground">{syncStatus}</p>
                </div>
              </TabsContent>
              <TabsContent value="console">
                <div className="p-4 min-h-[400px] md:min-h-[630px] lg:min-h-[630px] bg-gray-500 text-white">
                  Console placeholder
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
            <div className="grid gap-2 pt-2">
              <HoverCard openDelay={200}>
                <HoverCardTrigger asChild>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="refresh">Notes Actions</Label>
                    </div>
                    <Button id="refresh" variant="outline" onClick={fetchNote}>
                      <SymbolIcon className="mr-2 h-4 w-4" /> Refresh Notes
                    </Button>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent
                  align="start"
                  className="w-[260px] text-sm"
                  side="left"
                >
                  To view changes to the Notes made by someone else during this
                  session, before making any new changes yourself, click this
                  button.
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
