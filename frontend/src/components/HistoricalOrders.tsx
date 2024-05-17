import { Button, CardBody, Typography } from "@material-tailwind/react";

import {
  convertTimestampToTime,
  getStatus,
  getType,
  getTypeColor,
  getColorForStatus,
} from "../utils/helperFunction";

const HistoricalOrders = ({ historicalOrders }) => {
  const TABLE_HEAD = [
    "Time",
    "Price (USDC)",
    "Quantity",
    "TotalPrice (USDC)",
    "Type",
    "Status",
  ];

  return (
    <div
      className={`w-full rounded-[10px] border border-white/10 flex flex-col gap-4 p-4 bg-[#888888]/10`}
    >
      {/* //tab div */}
      <div className="w-full">
        <Button className="w-full bg-primary text-black " placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
          Historical Orders
        </Button>
      </div>

      {/* pending orders list div */}
      {historicalOrders.length == 0 ? (
        <p className="text-white text-center">No historicalOrders</p>
      ) : (
        <div className={`h-full w-full`}>
          <CardBody className="overflow-scroll px-0 " placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}>
            <table className="-mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr className="border-none *:border-none bg-primary-dark ">
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className=" bg-inherit p-4 ">
                      <Typography
                        variant="small"
                        className="font-normal leading-none  text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {historicalOrders?.map(
                  (
                    { createdAt, price, quantity, isBuyOrder, status },
                    index
                  ) => {
                    const isLast = index === historicalOrders?.length - 1;
                    const classes = isLast ? "p-4" : "p-4";

                    return (
                      <tr key={index} className="hover:bg-[#131823] border-b">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                {convertTimestampToTime(Number(createdAt))}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                              >
                                {Number(price)}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            {Number(quantity)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            {Number(price) * Number(quantity)}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color={`${getTypeColor(isBuyOrder)}`}
                            className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            {getType(isBuyOrder)}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color={`${getColorForStatus(status)}`}
                            className="font-normal" placeholder={undefined} onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined}                          >
                            {getStatus(status)}
                          </Typography>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </CardBody>
        </div>
      )}
    </div>
  );
};

export default HistoricalOrders;
