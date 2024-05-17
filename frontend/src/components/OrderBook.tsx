import {
  CardBody,
  Tab,
  Tabs,
  TabsHeader,
  Typography,
} from "@material-tailwind/react";
import { useState } from "react";
import {
  convertTimestampToTime,
  getStatus,
  getType,
  getTypeColor,
  getColorForStatus,
} from "../utils/helperFunction";

const OrderBook = ({ pendingOrders, activeOrders }) => {
  const [activeTab, setActiveTab] = useState("Active");
  const TABS = [
    {
      label: "Active",
      value: "Active",
    },
    {
      label: "Pending",
      value: "Pending",
    },
  ];

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
      <div>
        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="bg-secondary shadow-inner shadow-[#1A1D29]/30 p-1"
            indicatorProps={{ className: "bg-primary" }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {TABS.map(({ label, value }) => (
              <Tab
                onClick={() => setActiveTab(value)}
                key={value}
                className={`text-sm ${
                  activeTab === value ? "text-black" : "text-white"
                } p-2`}
                value={value}
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
        </Tabs>
      </div>

      {/* pending orders list div */}
      {pendingOrders.length == 0 && activeTab === "Pending" ? (
        <p className="text-white text-center">No pending orders</p>
      ) : (
        <div
          className={`h-full w-full ${
            activeTab === "Pending" ? "block" : "hidden"
          }`}
        >
          <CardBody
            className="overflow-x-hidden max-h-96 px-0 "
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <table className="-mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr className="border-none *:border-none bg-primary-dark ">
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className=" bg-inherit p-4 ">
                      <Typography
                        variant="small"
                        className="font-normal leading-none  text-white"
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
              <tbody>
                {pendingOrders?.map(
                  (
                    { createdAt, price, quantity, isBuyOrder, status }: any,
                    index: number
                  ) => {
                    const isLast = index === pendingOrders?.length - 1;
                    const classes = isLast ? "p-4" : "p-4";

                    return (
                      <tr key={index} className="hover:bg-[#131823] border-b">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal text-white"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
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
                                className="font-normal text-white"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {Number(price)}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {Number(quantity)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {Number(price) * Number(quantity)}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color={`${getTypeColor(isBuyOrder)}`}
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {getType(isBuyOrder)}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color={`${getColorForStatus(status)}`}
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
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

      {/* active order list */}
      {activeOrders.length == 0 && activeTab === "Active" ? (
        <p className="text-center text-white">No active orders</p>
      ) : (
        <div
          className={`h-full w-full ${
            activeTab === "Active" ? "block" : "hidden"
          }`}
        >
          <CardBody
            className="overflow-x-hidden max-h-96 px-0 "
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <table className="-mt-4 w-full min-w-max table-auto text-left">
              <thead>
                <tr className="border-none *:border-none bg-primary-dark text-secondary-text">
                  {TABLE_HEAD.map((head) => (
                    <th key={head} className=" bg-inherit p-4 ">
                      <Typography
                        variant="small"
                        className="font-normal leading-none  text-white"
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
              <tbody>
                {activeOrders?.map(
                  (
                    { createdAt, price, quantity, status }: any,
                    index: number
                  ) => {
                    const isLast = index === activeOrders?.length - 1;
                    const classes = isLast ? "p-4" : "p-4";

                    return (
                      <tr key={index} className="hover:bg-[#131823] border-b">
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <Typography
                                variant="small"
                                className="font-normal text-white"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
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
                                className="font-normal text-white"
                                placeholder={undefined}
                                onPointerEnterCapture={undefined}
                                onPointerLeaveCapture={undefined}
                              >
                                {Number(price)}
                              </Typography>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {Number(quantity)}
                          </Typography>
                        </td>
                        <td className={classes}>
                          <Typography
                            variant="small"
                            className="font-normal text-white"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
                            {Number(price) * Number(quantity)}
                          </Typography>
                        </td>

                        <td className={classes}>
                          <Typography
                            variant="small"
                            color={`${getColorForStatus(status)}`}
                            className="font-normal"
                            placeholder={undefined}
                            onPointerEnterCapture={undefined}
                            onPointerLeaveCapture={undefined}
                          >
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

export default OrderBook;
