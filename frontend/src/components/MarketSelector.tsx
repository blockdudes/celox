import { useState } from "react";
import MarketSelectOptionTable from "./MarketSelectOptionTable.tsx";
import { IoCaretDownSharp } from "react-icons/io5";
import { motion } from "framer-motion";

function MarketSelector({ selectedMarket, setSelectedMarket }) {
  const [showMarketOptions, setShowMarketOptions] = useState(false);

  const handleShowMarketOptions = () => {
    setShowMarketOptions(!showMarketOptions);
  };
  return (
    <div className="w-full relative">
      <div
        className="w-full bg-secondary  flex justify-between items-center gap-4 p-3 rounded-md cursor-pointer"
        onClick={() => handleShowMarketOptions()}
      >
        <div className="flex gap-3 items-center">
          <p className="text-primary-text text-md">{selectedMarket}</p>
        </div>
        <div>
          <IoCaretDownSharp color="white" />
        </div>
      </div>
      {showMarketOptions && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className=" w-full  h-full  absolute top-16"
        >
          <MarketSelectOptionTable
            setSelectedMarket={setSelectedMarket}
            setShowMarketOptions={setShowMarketOptions}
          />
        </motion.div>
      )}
    </div>
  );
}

export default MarketSelector;
