import {
  Button,
  Chip,
  Input,
  Tab,
  Tabs,
  TabsHeader,
} from "@material-tailwind/react";
import { useState } from "react";

const CreateOrder = ({
  createOrder,
  setCreateOrder,
  createBuyOrder,
  createSellOrder,
  isApprovalLoading,
  isOrderLoading,
  userTokenBalance,
  getApproval,
  SelectedMarket,
}) => {
  const [activeTab, setActiveTab] = useState("Buy");
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);
  const TABS = [
    {
      label: "Buy",
      value: "Buy",
    },
    {
      label: "Sell",
      value: "Sell",
    },
  ];

  const handleTab = (value) => {
    setActiveTab(value);
    setCreateOrder((prev) => ({ ...prev, type: value }));
  };

  const handleSubmitCreateOrder = () => {
    if (createOrder.type === "Buy") {
      createBuyOrder();
    } else {
      createSellOrder();
    }
  };

  return (
    <div className="p-8">
      <div className="bg-[#0C0A09] border border-white/10 relative rounded-[10px] p-4  flex flex-col items-center gap-3">
        {/* caption */}

        <Tabs value={activeTab} className="w-full">
          <TabsHeader
            className="bg-[#292524] shadow-inner shadow-[#1A1D29]/30  p-1"
            indicatorProps={{ className: "bg-primary" }}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {TABS.map(({ label, value }) => (
              <Tab
                onClick={() => handleTab(value)}
                key={value}
                className={`text-sm font-medium ${
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

        {/* //content */}
        <div className="flex flex-col gap-3 w-full">
          {/* pay div content */}
          <div className="relative bg-[#292524] flex flex-col gap-2 rounded-[10px] pt-6 pb-0 px-2">
            <div className="absolute top-2 left-2 flex justify-between items-center text-sm text-white">
              <p>Price</p>
            </div>
            <div className="flex justify-between text-sm text-white">
              <Input
                defaultValue={0}
                labelProps={{ className: "hidden after:content-none " }}
                className="border-none text-left text-sm text-white"
                containerProps={{ className: "min-w-[50px]" }}
                onChange={(e) =>
                  setCreateOrder({ ...createOrder, price: e.target.value })
                }
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
              <Chip
                value={
                  createOrder.type === "Buy"
                    ? SelectedMarket.split("/")[1]
                    : SelectedMarket.split("/")[0]
                }
                size="sm"
                className="h-5 bg-transparent text-primary font-semibold text-xs"
              />
            </div>
            {/* <div className="flex justify-between text-xs text-white">
              <p>Balance</p>
              <p>
                {Number(userTokenBalance)}{" "}
                <sub className="text-[#B3B3B3]">USDC</sub>
              </p>
            </div> */}
          </div>

          {/* recieve content */}
          <div className="relative bg-[#292524] flex flex-col gap-2 rounded-[10px] pt-6 pb-0 px-2">
            <div className="absolute top-2 left-2 flex justify-between text-sm text-white">
              <p>Quantity</p>
            </div>
            <div className="flex justify-between text-sm text-white">
              {/* //select recieve token */}

              {/* //token amount to recieve */}
              <Input
                defaultValue={0}
                labelProps={{ className: "hidden after:content-none " }}
                className="border-none text-left text-sm text-white"
                containerProps={{ className: "min-w-[50px]" }}
                onChange={(e) =>
                  setCreateOrder({ ...createOrder, quantity: e.target.value })
                }
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                crossOrigin={undefined}
              />
            </div>
          </div>

          <div className="flex text-end justify-end text-xs text-tertiary-text select-none">
            <p
              className="cursor-pointer hover:underline"
              onClick={() => setAdvancedOptionsVisible(!advancedOptionsVisible)}
            >
              Show Advanced Options
            </p>
          </div>

          {advancedOptionsVisible && (
            <div className="relative bg-[#292524] flex flex-col gap-2 rounded-[10px] pt-6 pb-0 px-2">
              <div className="absolute top-2 left-2 flex justify-between text-sm text-white">
                <p>Expired After(sec)</p>
              </div>
              <div className="flex justify-between text-sm text-white">
                <Input
                  value={createOrder.expireAfter}
                  labelProps={{ className: "hidden after:content-none " }}
                  className="border-none text-left text-sm text-white"
                  containerProps={{ className: "min-w-[50px]" }}
                  onChange={(e) =>
                    setCreateOrder({
                      ...createOrder,
                      expireAfter: e.target.value,
                    })
                  }
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  crossOrigin={undefined}
                />
              </div>
            </div>
          )}

          {/* //button1 */}
          <Button
            disabled={
              Number(userTokenBalance) <= 0 ||
              createOrder.price === 0 ||
              createOrder.quantity === 0 ||
              createOrder.price === "" ||
              createOrder.quantity === ""
            }
            loading={isApprovalLoading}
            className="bg-primary text-black"
            onClick={() => getApproval()}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Approve
          </Button>
          <Button
            disabled={
              Number(userTokenBalance) <= 0 ||
              createOrder.price === 0 ||
              createOrder.quantity === 0 ||
              createOrder.price === "" ||
              createOrder.quantity === ""
            }
            loading={isOrderLoading}
            className="bg-primary text-black"
            onClick={() => handleSubmitCreateOrder()}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Create Order
          </Button>
          {/* <Button onClick={() => checkBalance()}>checkBalance</Button>
                    <Button onClick={() => getPendingOrder()}>getPendingOrder</Button>
                    <Button onClick={() => getHistoricalOrder()}>getHistoricalOrder</Button>
                    <Button onClick={() => getPendingOrder()}>getPendingOrder</Button>
                    <Button onClick={() => cancelOrder()}>cancelOrder</Button> */}
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
