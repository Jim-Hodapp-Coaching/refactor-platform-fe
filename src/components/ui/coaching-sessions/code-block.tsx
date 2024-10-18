import React from "react";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";
import { ProgrammingLanguageSelector } from "./programming-language-selector";

import "@/styles/code-block.scss";

const CodeBlock: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  extension,
}) => {
  const language = node.attrs.language || "auto";

  return (
    <NodeViewWrapper className="code-block">
      <ProgrammingLanguageSelector
        languages={extension.options.lowlight
          .listLanguages()
          .map((lang: string, index: number) => lang)}
        placeholder={language}
        onSelect={(languageTitle: string) => {
          updateAttributes({ language: languageTitle });
        }}
      ></ProgrammingLanguageSelector>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
