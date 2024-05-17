import { useEffect, useRef, useState } from "react";
import AreaChart from "./AreaChart";
import { useChartDataState } from "../context/chartDataContext";

export const CurrentMarket = () => {
  const ref = useRef();
  const { width } = useContainerDimensions(ref);
  const data = useChartDataState().chartData;

  return (
    <div className="w-full" ref={ref}>
      {ref.current != null && (
        <AreaChart width={width * 0.99} height={width * 0.5} data={data} />
      )}
    </div>
  );
};

const useContainerDimensions = (myRef) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const getDimensions = () => ({
      width: myRef.current.offsetWidth,
      height: myRef.current.offsetHeight,
    });

    const handleResize = () => {
      setDimensions(getDimensions());
    };

    if (myRef.current) {
      setDimensions(getDimensions());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [myRef]);

  return dimensions;
};
