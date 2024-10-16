"use client";

import { useEditor, EditorContent, ReactNodeViewRenderer } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import BulletList from "@tiptap/extension-bullet-list";
import Highlight from "@tiptap/extension-highlight";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Strikethrough,
  Braces,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { forwardRef, useImperativeHandle } from "react";

import { EditorRef } from "./coaching-notes";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
// Load all languages with "all" or common languages with "common"
import { all, createLowlight } from "lowlight";

// eslint-disable-next-line
import CodeBlock from "@/components/ui/coaching-sessions/code-block";

import "@/styles/styles.scss";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

interface TipTapProps {
  editorContent: string;
  onChange: (content: string) => void;
}

const TipTapEditor = forwardRef<EditorRef, TipTapProps>(
  ({ editorContent, onChange }, ref) => {
    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          ListItem,
          Underline,
          Highlight,
          BulletList,
          OrderedList,
          CodeBlockLowlight.extend({
            addNodeView() {
              return ReactNodeViewRenderer(CodeBlock);
            },
          }).configure({ lowlight }),
        ],

        autofocus: false,
        immediatelyRender: false,

        editorProps: {
          attributes: {
            class:
              // Make this responsive to light/dark mode
              // Also is the background what's preventing the codeblock background color from working?
              // "tiptap ProseMirror",
              "tiptap ProseMirror shadow appearance-none lg:min-h-[440px] sm:min-h-[200px] md:min-h-[350px] rounded w-full py-2 px-3 bg-inherit text-black text-sm mt-0 md:mt-3 leading-tight focus:outline-none focus:shadow-outline",
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
      <div className="border rounded">
        {/* Toolbar style */}
        <div className="flex items-center gap-0 mt-1 mx-1 mb-0">
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
            title="Strike Through"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>

          {/* Highlight Button */}
          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 rounded ${
              editor.isActive("highlight") ? "bg-gray-200" : ""
            }`}
            title="Highlight Text"
          >
            <Highlighter className="h-4 w-4" />
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
            title="Heading1"
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
            title="Heading2"
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
            title="Heading3"
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

          <Button
            variant="ghost"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded ${
              editor.isActive("codeBlock") ? "is-active" : ""
            }`}
          >
            <Braces className="h-4 w-4" />
          </Button>
        </div>
        {/* Editor Content */}
        <EditorContent editor={editor} />
      </div>
    );
  }
);

TipTapEditor.displayName = "TipTapEditor";

export { TipTapEditor };
