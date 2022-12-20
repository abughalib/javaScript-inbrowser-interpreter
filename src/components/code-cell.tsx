import React, { useState, useEffect } from "react";
import CodeEditor from "./code-editor";
import Preview from "./preview";
import bundler from "../builder/bundler";
import Resizable from "./resizable";
import { Cell } from "../state/cell";
import { useActions } from "./hooks/use-actions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const [err, setErr] = useState("");
  const [code, setCode] = useState("");
  const { updateCell } = useActions();

  useEffect(() => {
    let timer: NodeJS.Timer = setTimeout(async () => {
      const output = await bundler(cell.content);
      setCode(output.code);
      setErr(output.err);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [cell.content]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100%-10px);",
          display: "flex",
          flexDirection: "row",
        }}
        className="code-editor"
      >
        <Resizable direction="horizontal">
          <CodeEditor
            onChange={(value) => {
              updateCell(cell.id, value || "");
            }}
            initialValue={cell.content}
          />
        </Resizable>
        <Preview code={code} error={err} />
      </div>
    </Resizable>
  );
};

export default CodeCell;
