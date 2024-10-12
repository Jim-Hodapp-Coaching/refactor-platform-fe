"use client";

import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { forwardRef, useImperativeHandle } from "react";

import "@/styles/styles.scss";
import { EditorRef } from "./coaching-notes";

interface TipTapProps {
  editorContent: string;
  onChange: (content: string) => void;
}

const TipTapEditor = forwardRef<EditorRef, TipTapProps>(
  ({ editorContent, onChange }, ref) => {
    const editor = useEditor(
      {
        extensions: [StarterKit, ListItem, Underline],

        autofocus: false,
        immediatelyRender: false,

        editorProps: {
          attributes: {
            class:
              "shadow appearance-none lg:min-h-[600px] sm:min-h-[200px] md:min-h-[400px] border rounded w-full py-2 px-3 bg-white text-black text-sm mt-0 md:mt-3 leading-tight focus:outline-none focus:shadow-outline",
          },
        },

        content: editorContent,
        onUpdate: ({ editor }) => {
          onChange(JSON.stringify(editor.getJSON()));
        },
      },
      []
    );

    useImperativeHandle(ref, () => ({
      setContent: (content: string) => {
        editor?.commands.setContent(JSON.parse(content));
      },

      setFocussed: () => {
        editor?.chain().focus().run();
      },
    }));

    if (!editor) {
      return null;
    }

    return (
      <div className="flex flex-col justify-stretch min-h-[200px] border rounded border-b-0">
        <div className="flex items-center gap-0 mb-0">
          {/* Bold Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded ${
              editor.isActive("bold") ? "bg-gray-200" : ""
            }`}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </Button>

          {/* Italic Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded ${
              editor.isActive("italic") ? "bg-gray-200" : ""
            }`}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </Button>

          {/* Underline Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded ${
              editor.isActive("underline") ? "bg-gray-200" : ""
            }`}
            title="Italic (Ctrl+I)"
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>

          {/* Strikethrough Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded ${
              editor.isActive("strike") ? "bg-gray-200" : ""
            }`}
            title="Strike Through (Ctrl+Shift+X)"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          {/* Heading 1 */}
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`p-2 rounded ${
              editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
            }`}
          >
            <Heading1 className="h-4 w-4" />
          </Button>

          {/* Heading */}
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`p-2 rounded ${
              editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
            }`}
          >
            <Heading2 className="h-4 w-4" />
          </Button>

          {/* Heading 3 */}
          <Button
            variant="ghost"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`p-2 rounded ${
              editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""
            }`}
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          {/* Bullet List Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded ${
              editor.isActive("bulletList") ? "bg-gray-200" : ""
            }`}
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </Button>

          {/* Ordered List Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded ${
              editor.isActive("orderedList") ? "bg-gray-200" : ""
            }`}
            title="Ordered List"
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>
        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

export { TipTapEditor };
