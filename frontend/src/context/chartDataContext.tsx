import { createContext, useContext, useState } from "react";
import { ChartDataType } from "../components/AreaChart";

export const ChartDataContext = createContext(null);

export const ChartDataProvider = ({ children }) => {
  const [chartData, setChartData] = useState<{
    buyOrder: ChartDataType[];
    sellOrder: ChartDataType[];
  }>({
    buyOrder: [],
    sellOrder: [],
  });

  return (
    <ChartDataContext.Provider value={{ chartData, setChartData }}>
      {children}
    </ChartDataContext.Provider>
  );
};

export const useChartDataState = () => {
  const context: {
    chartData: {
      buyOrders: ChartDataType[];
      sellOrders: ChartDataType[];
    };
    setChartData: React.Dispatch<
      React.SetStateAction<{
        buyOrder: ChartDataType[];
        sellOrder: ChartDataType[];
      }>
    >;
  } = useContext(ChartDataContext);

  if (context === undefined) {
    throw new Error(
      "useChartDataState must be used within a ChartDataProvider"
    );
  }
  return context;
};
