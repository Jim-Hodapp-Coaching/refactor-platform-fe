"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import { TipTapEditor } from "@/components/ui/coaching-sessions/tiptap-editor";

export interface EditorRef {
  setContent: (content: string) => void;
  setFocussed: () => void;
}

interface CoachingNotesProps {
  value: string;
  onChange: (content: string) => void;
  onKeyDown: () => void;
}

const CoachingNotes = forwardRef<EditorRef, CoachingNotesProps>(
  ({ value, onChange, onKeyDown }, ref) => {
    const WAIT_INTERVAL = 1000;
    const timerRef = useRef<number | undefined>(undefined);
    const [note, setNote] = useState<string>(value);

    useEffect(() => {
      setNote(value);
    }, [value]);

    const handleSessionNoteChange = useCallback(
      (newValue: string) => {
        onKeyDown();
        setNote(newValue);

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
          console.debug(
            "Calling onChange() from CoachingNotes::handleSessionNoteChange() timer"
          );
          onChange(newValue);
        }, WAIT_INTERVAL);
      },
      [onKeyDown, onChange, WAIT_INTERVAL]
    );

    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    return (
      <TipTapEditor
        ref={ref}
        editorContent={note}
        onChange={handleSessionNoteChange}
      />
    );
  }
);

export { CoachingNotes };
