import { Id } from "@/types/general";
import {
  defaultOverarchingGoal,
  defaultOverarchingGoals,
  getOverarchingGoalById,
  OverarchingGoal,
} from "@/types/overarching-goal";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface OverarchingGoalState {
  currentOverarchingGoalId: Id;
  currentOverarchingGoal: OverarchingGoal;
  currentOverarchingGoals: OverarchingGoal[];
}

interface OverarchingGoalStateActions {
  getCurrentOverarchingGoal: (overarchingGoalId: Id) => OverarchingGoal;
  setCurrentOverarchingGoalId: (newOverarchingGoalId: Id) => void;
  setCurrentOverarchingGoal: (newOverarchingGoal: OverarchingGoal) => void;
  setCurrentOverarchingGoals: (newOverarchingGoals: OverarchingGoal[]) => void;
  resetOverarchingGoalState(): void;
}

export type OverarchingGoalStateStore = OverarchingGoalState &
  OverarchingGoalStateActions;

export const defaultInitState: OverarchingGoalState = {
  currentOverarchingGoalId: "",
  currentOverarchingGoal: defaultOverarchingGoal(),
  currentOverarchingGoals: defaultOverarchingGoals(),
};

export const createOverarchingGoalStateStore = (
  initState: OverarchingGoalState = defaultInitState
) => {
  const oagStateStore = create<OverarchingGoalStateStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initState,

          // Expects the array of OverarchingGoals to be fetched and set
          getCurrentOverarchingGoal: (
            overarchingGoalId: Id
          ): OverarchingGoal => {
            return get().currentOverarchingGoals
              ? getOverarchingGoalById(
                  overarchingGoalId,
                  get().currentOverarchingGoals
                )
              : defaultOverarchingGoal();
          },
          setCurrentOverarchingGoalId: (newOverarchingGoalId) => {
            set({ currentOverarchingGoalId: newOverarchingGoalId });
          },
          setCurrentOverarchingGoal: (newOverarchingGoal) => {
            set({ currentOverarchingGoal: newOverarchingGoal });
          },
          setCurrentOverarchingGoals(newOverarchingGoals: OverarchingGoal[]) {
            set({ currentOverarchingGoals: newOverarchingGoals });
          },
          resetOverarchingGoalState(): void {
            set(defaultInitState);
          },
        }),
        {
          name: "overarching-goal-state-store",
          storage: createJSONStorage(() => sessionStorage),
        }
      )
    )
  );
  return oagStateStore;
};
