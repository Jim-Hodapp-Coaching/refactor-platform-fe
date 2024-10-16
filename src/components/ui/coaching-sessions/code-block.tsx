import React from "react";
import { NodeViewProps, NodeViewWrapper, NodeViewContent } from "@tiptap/react";

import "@/styles/code-block.scss";

const CodeBlock: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  extension,
}) => {
  const language = node.attrs.language || "auto";

  return (
    <NodeViewWrapper className="code-block">
      <select
        contentEditable={false}
        defaultValue={language}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          updateAttributes({ language: event.target.value })
        }
      >
        <option value="auto">auto</option>
        <option disabled>—</option>
        {extension.options.lowlight
          .listLanguages()
          .map((lang: string, index: number) => (
            <option key={index} value={lang}>
              {lang}
            </option>
          ))}
      </select>
      <pre>
        <NodeViewContent as="code" />
      </pre>
    </NodeViewWrapper>
  );
};

export default CodeBlock;
