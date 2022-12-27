import CodeEditor from "./code-editor";
import Preview from "./preview";
import Resizable from "./resizable";
import { Cell } from "../state/cell";
import { useActions } from "./hooks/use-actions";
import { useTypedSelector } from "./hooks/use-typed-selector";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { updateCell } = useActions();
  const bundle = useTypedSelector((state) => state.bundles![cell.id]);

  return (
    <Resizable direction="vertical">
      <div
        style={{
          height: "calc(100%-10px)",
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
        <div>
          {!bundle ? (
            <div className="code-preview-iframe">
              <Preview code="" error="" />
            </div>
          ) : (
            <Preview code={bundle.code} error={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
