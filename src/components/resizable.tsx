import { ResizableBox } from "react-resizable";
import "./resizable.css";

interface ResizableProps {
  direction: "horizontal" | "vertical";
  children: React.ReactNode;
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  return (
    <ResizableBox
      height={300}
      width={Infinity}
      resizeHandles={["s"]}
      maxConstraints={[Infinity, window.innerHeight * 0.95]}
      minConstraints={[Infinity, 100]}
    >
      {children}
    </ResizableBox>
  );
};

export default Resizable;
