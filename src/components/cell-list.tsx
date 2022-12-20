import { Fragment } from "react";
import CellListItem from "./cell-list-item";
import { useTypedSelector } from "./hooks/use-typed-selector";
import AddCell from "./add-cell";

const CellList: React.FC = () => {
  const cells = useTypedSelector((state) => {
    return state.cells!.order.map((id: any) => {
      return state.cells!.data[id];
    });
  });

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div>
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
