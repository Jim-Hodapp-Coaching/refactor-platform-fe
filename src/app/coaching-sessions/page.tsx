"use client";

import { Metadata } from "next";

import * as React from "react"

import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

import { ChevronsUpDown, Plus, X } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { CodeViewer } from "@/components/ui/code-viewer";
import { MaxLengthSelector } from "@/components/ui/maxlength-selector";
import { ModelSelector } from "@/components/ui/model-selector";
import { PresetActions } from "@/components/ui/preset-actions";
import { PresetSelector } from "@/components/ui/preset-selector";
import { PresetShare } from "@/components/ui/preset-share";
import { TemperatureSelector } from "@/components/ui/temperature-selector";
import { TopPSelector } from "@/components/ui/top-p-selector";
import { cn } from "@/lib/utils"
import { models, types } from "../../data/models";
import { current, future, past } from "../../data/presets";

// export const metadata: Metadata = {
//   title: "Coaching Session",
//   description: "Coaching session main page, where the good stuff happens.",
// };

export default function CoachingSessionsPage() {
  const [isOpen, setIsOpen] = React.useState(false);

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

      <div className="flex flex-col pt-4  px-4">
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between px-4">
            <Button
              variant="outline"
              className={cn(
                "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
              )}
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="hidden lg:inline-flex">Overarching goal: to achieve...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              {/* <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>G
              </kbd> */}
            </Button>
            <CollapsibleTrigger asChild className="justify-items-end">
              {/* <span className="justify-items-end">
                <ChevronsUpDown className="h-4 w-4" />
              </span> */}
            </CollapsibleTrigger>
            
          </div>
          <CollapsibleContent className="space-y-2 px-4">
            <div className="flex-col space-y-4 pb-2 sm:flex">
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
            <Separator />
          </CollapsibleContent>
        </Collapsible>
      </div>


      <div className="flex flex-col">
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="flex-col space-y-4 sm:flex md:order-1">
              <Tabs defaultValue="notes" className="flex-1">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="program">Program</TabsTrigger>
                  <TabsTrigger value="console">Console</TabsTrigger>
                  <TabsTrigger value="coachs_notes">Coach&#39;s Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="notes">
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Notes"
                      className="min-h-[400px] flex-1 p-4 md:min-h-[630px] lg:min-h-[630px]"
                    />
                  </div>
                </TabsContent>
                <TabsContent value="program">
                  <div className="bg-red-500 text-white p-4">Program</div>
                </TabsContent>
                <TabsContent value="console">
                  <div className="bg-blue-500 text-white p-4">Console</div>
                </TabsContent>
                <TabsContent value="coachs_notes">
                  <div className="flex h-full flex-col space-y-4">
                    <Textarea
                      placeholder="Coach's notes"
                      className="min-h-[400px] flex-1 p-4 md:min-h-[630px] lg:min-h-[630px]"
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
