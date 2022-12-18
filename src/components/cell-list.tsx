import CellListItem from "./cell-list-item";
import { useTypedSelector } from "./hooks/use-typed-selector";

const CellList: React.FC = () => {
  const cells = useTypedSelector((state) => {
    return state.cells!.order.map((id: any) => {
      return state.cells!.data[id];
    });
  });

  const renderedCells = cells.map((cell) => (
    <CellListItem key={cell.id} cell={cell} />
  ));

  return <div>{renderedCells}</div>;
};

export default CellList;
