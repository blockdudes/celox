import { Typography } from "@material-tailwind/react";

const TABLE_HEAD = ["Market", "Price", "24h", "Volume"];

const TABLE_ROWS = [
  {
    market: "DOGE/USDC",
    unitPrice: "3030 USDC",
    hrs: "2%",
    volume: "1000",
  },
  {
    market: "SOL/USDC",
    unitPrice: "7.5 USDC",
    hrs: "4%",
    volume: "1000",
  },
];

const MarketSelectOptionTable = ({
  setSelectedMarket,
  setShowMarketOptions,
}) => {
  const handleSetSelectedMarket = (market) => {
    setSelectedMarket(market);
    setShowMarketOptions(false);
  };
  return (
    <div className="w-full">
      <table className="w-full  text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="bg-primary-dark p-4">
                <Typography
                  variant="small"
                  color="white"
                  className="leading-none text-secondary-text font-semibold"
                  placeholder={undefined}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-secondary">
          {TABLE_ROWS.map(({ market, unitPrice, hrs, volume }, index) => {
            const isLast = index === TABLE_ROWS.length - 1;
            const classes = isLast
              ? "p-4"
              : "p-4 border-b border-blue-gray-50  ";

            return (
              <tr
                className="cursor-pointer"
                key={market}
                onClick={() => handleSetSelectedMarket(market)}
              >
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {market}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {unitPrice}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {hrs}
                  </Typography>
                </td>
                <td className={classes}>
                  <Typography
                    variant="small"
                    color="white"
                    className="font-normal"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    {volume}
                  </Typography>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default MarketSelectOptionTable;
