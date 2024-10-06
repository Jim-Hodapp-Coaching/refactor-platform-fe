"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const OverarchingGoal: React.FC<{ onClick: (open: boolean) => void }> = ({
  onClick,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [goal, setGoal] = useState<string>("");
  const [tempGoal, setTempGoal] = useState(goal);

  useEffect(() => {
    // Update tempGoal whenever goal changes
    setTempGoal(goal);
  }, [goal]);

  const toggleDrawer = () => {
    if (isOpen) {
      // When closing, reset tempGoal to match the current goal
      setTempGoal(goal);
    }
    onClick(!isOpen);
    setIsOpen(!isOpen);
  };

  const handleSetGoal = async () => {
    // TODO: make a new callback function for when the goal gets set so the parent can
    // call the backend and store the new overarching goal.
    setGoal(tempGoal); // Update the main goal state
    toggleDrawer();
  };

  return (
    <div className="flex items-center justify-between px-4">
      <div
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted hover:bg-gray-200 text-sm font-semibold text-muted-foreground shadow-inner flex items-center px-3"
        )}
      >
        <div className="flex items-center justify-between w-full">
          <div id="label" className="flex w-full mr-2 min-w-0">
            {isOpen ? (
              <Input
                value={tempGoal}
                onChange={(e) => setTempGoal(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSetGoal()}
                className={cn("w-full h-6 bg-inherit border-0 p-1")}
                placeholder="Insert a new overarching goal"
              />
            ) : (
              <div>
                <span className="hidden md:inline-flex truncate">
                  <div className="mr-1">{"Overarching goal: "}</div>
                  <div>{goal}</div>
                </span>
                <span className="inline-flex md:hidden">{goal}</span>
              </div>
            )}
          </div>
          <div
            id="buttons"
            className="flex items-center space-x-2 flex-shrink-0 ml-auto"
          >
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
            <div className="flex items-center space-x-2">
              {isOpen && (
                <Button
                  variant="ghost"
                  className={cn("h-6 hover:bg-gray-400")}
                  onClick={handleSetGoal}
                >
                  Set
                </Button>
              )}
              <Button
                onClick={toggleDrawer}
                variant="ghost"
                size="icon"
                className={cn("h-6 p-0 hover:bg-gray-400")}
              >
                {isOpen ? (
                  <ChevronUp className="h-6 w-6" />
                ) : (
                  <ChevronDown className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
        {/* </Button> */}
      </div>
    </div>
  );
};

export { OverarchingGoal };
