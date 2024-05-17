import MarketSelector from "./components/MarketSelector.tsx";
import CreateOrder from "./components/CreateOrder.tsx";
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Spinner,
} from "@material-tailwind/react";
import { CurrentMarket } from "./components/CurrentMarket.tsx";
import HistoricalOrders from "./components/HistoricalOrders.tsx";
import OrderBook from "./components/OrderBook.tsx";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import abi from "./contract/abi.json";
import erc_20_abi from "./contract/erc20_ABI.json";
import { supportedChains } from "./market/market.ts";
import { FaChevronDown } from "react-icons/fa";
import { convertToOrder } from "./utils/helperFunction.ts";
import {
  ThirdwebContract,
  createThirdwebClient,
  getContract,
  prepareContractCall,
  readContract,
  sendAndConfirmTransaction,
} from "thirdweb";
import { useConnect, useSwitchActiveWalletChain } from "thirdweb/react";
import { createWallet, injectedProvider, Wallet } from "thirdweb/wallets";
import { Abi } from "abitype";
import logo from "./assets/logo.svg";
import { useChartDataState } from "./context/chartDataContext.tsx";

const contractABI = abi as Abi;
const ERC20ABI = erc_20_abi as Abi;

const client = createThirdwebClient({
  clientId: "50c3ad9e3e6a65ebd574463c384c0a5f",
});

function App() {
  const { connect, isConnecting } = useConnect();
  const switchActiveWalletChain = useSwitchActiveWalletChain();

  const { setChartData } = useChartDataState();
  const [selectedMarket, setSelectedMarket] = useState("DOGE/USDC");
  const [selectedChain, setSelectedChain] = useState("Blockdudes testnet");
  const [wallet, setWallet] = useState<Wallet>();
  const [isApprovalLoading, setIsApprovalLoading] = useState(false);
  const [isOrderLoading, setIsOrderLoading] = useState(false);
  const [createOrder, setCreateOrder] = useState({
    price: 0,
    quantity: 0,
    type: "Buy",
    expireAfter: 600,
  });
  const [contractInstance, setContractInstance] =
    useState<Readonly<ThirdwebContract<Abi>>>(null);
  const [usdcContractInstance, setUsdcContractInstance] =
    useState<Readonly<ThirdwebContract<Abi>>>(null);

  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [historicalOrders, setHistoricalOrders] = useState([]);
  const [userTokenBalance, setUserTokenBalance] = useState<bigint>(BigInt(0));

  const connectWallet = async () => {
    const wallet: Wallet = await connect(async () => {
      const metamask = createWallet("io.metamask"); // pass the wallet id

      // if user has metamask installed, connect to it
      if (injectedProvider("io.metamask")) {
        await metamask.connect({ client });
      }

      // open wallet connect modal so user can scan the QR code and connect
      else {
        await metamask.connect({
          client,
        });
      }

      // return the wallet
      return metamask;
    });
    setWallet(wallet);
    var contract = getContract({
      client,
      chain: supportedChains.get(selectedChain).chain,
      address: supportedChains.get(selectedChain).contractAddress,
      abi: contractABI,
    });
    setContractInstance(contract);
    var usdcContract = getContract({
      client,
      chain: supportedChains.get(selectedChain).chain,
      address: supportedChains.get(selectedChain).usdcAddress,
      abi: ERC20ABI,
    });
    setUsdcContractInstance(usdcContract);
    if (wallet != null) {
      toast.success("Wallet connected successfully");
    }
  };

  const createTokenInstance = (
    contractAddress: string
  ): ThirdwebContract<Abi> => {
    return getContract({
      client,
      chain: supportedChains.get(selectedChain).chain,
      address: contractAddress,
      abi: ERC20ABI,
    });
  };

  const switchChain = async (chainName: string) => {
    setSelectedChain(chainName);
    await switchActiveWalletChain(supportedChains.get(chainName).chain);
  };

  const getSelectedMarketAddress = (): string => {
    const address =
      supportedChains.get(selectedChain).supportedMarket[selectedMarket];
    return address;
  };

  const getAllowance = async (
    tokenInstance: ThirdwebContract<Abi>
  ): Promise<bigint> => {
    var result = await readContract({
      contract: tokenInstance,
      method:
        "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",
      params: [wallet.getAccount().address, contractInstance.address],
    });
    return result;
  };

  const getApproval = async (tokenInstance: ThirdwebContract<Abi>) => {
    try {
      setIsApprovalLoading(true);
      var result = await getAllowance(tokenInstance);
      console.log(contractInstance);
      if (result < BigInt(createOrder.price * createOrder.quantity)) {
        if (createOrder.type === "Buy") {
          var tx = prepareContractCall({
            contract: usdcContractInstance,
            method:
              "function approve(address _spender, uint256 _value) public returns (bool success)",
            params: [
              contractInstance.address,
              BigInt(createOrder.price * createOrder.quantity),
            ],
          });
        } else {
          var tx = prepareContractCall({
            contract: tokenInstance,
            method:
              "function approve(address _spender, uint256 _value) public returns (bool success)",
            params: [contractInstance.address, BigInt(createOrder.quantity)],
          });
        }
        var approveResult = await sendAndConfirmTransaction({
          transaction: tx,
          account: wallet.getAccount(),
        });
        if (approveResult.status) {
          setIsApprovalLoading(false);
          toast.success("Approved successfully");
        } else {
          toast.success("Approval failed");
          setIsApprovalLoading(false);
        }
      } else {
        toast.success("Already approved");
        setIsApprovalLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createBuyOrder = async () => {
    try {
      const allowance = await getAllowance(usdcContractInstance);
      if (allowance < createOrder.price * createOrder.quantity) {
        toast.error(`Insufficient Allowance: ${allowance}`);
        return;
      }
      setIsOrderLoading(true);
      // await getApproval(usdcContractInstance);
      const marketAddress = getSelectedMarketAddress();
      var tx = prepareContractCall({
        contract: contractInstance,
        method:
          "function createOrder(address market, uint256 quantity, uint256 price, bool isBuyOrder, uint256 expireAfter)",
        params: [
          marketAddress,
          BigInt(createOrder.quantity),
          BigInt(createOrder.price),
          true,
          BigInt(createOrder.expireAfter),
        ],
      });
      var result = await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet.getAccount(),
      });
      if (result.status) {
        toast.success("Order created successfully");
      } else {
        toast.error("unable to create order");
      }
      setIsOrderLoading(false);
    } catch (error) {
      setIsOrderLoading(false);
      toast.error("unable to create order");
      console.log(error);
    }
  };

  const createSellOrder = async () => {
    try {
      const marketAddress = getSelectedMarketAddress();
      console.log(selectedMarket);
      const sellTokenContractInstance = createTokenInstance(marketAddress);
      const allowance = await getAllowance(sellTokenContractInstance);
      if (allowance < createOrder.quantity) {
        toast.error(`Insufficient Allowance: ${allowance}`);
        return;
      }
      setIsOrderLoading(true);
      // await getApproval(sellTokenContractInstance);
      var tx = prepareContractCall({
        contract: contractInstance,
        method:
          "function createOrder(address market, uint256 quantity, uint256 price, bool isBuyOrder, uint256 expireAfter)",
        params: [
          marketAddress,
          BigInt(createOrder.quantity),
          BigInt(createOrder.price),
          false,
          BigInt(createOrder.expireAfter),
        ],
      });
      var result = await sendAndConfirmTransaction({
        transaction: tx,
        account: wallet.getAccount(),
      });
      if (result.status) {
        toast.success("Order created successfully");
      } else {
        toast.error("unable to create order");
      }
      setIsOrderLoading(false);
    } catch (error) {
      setIsOrderLoading(false);
      toast.error("unable to create order");
      console.log(error);
    }
  };

  const getPendingOrder = async () => {
    try {
      const marketAddress = getSelectedMarketAddress();
      var res = await readContract({
        contract: contractInstance,
        method:
          "function getOrdersFromPendingOrders(address token) external view returns ((address, address, uint256, uint256, bool, uint256, uint256, uint256, uint256)[] memory)",
        params: [marketAddress],
      });

      setPendingOrders(convertToOrder(res));
    } catch (error) {
      console.log(error);
    }
  };

  const getActiveOrCurrentOrder = async () => {
    try {
      const marketAddress = getSelectedMarketAddress();
      const res = await readContract({
        contract: contractInstance,
        method:
          "function getOrdersFromCurrentOrders(address token) external view returns ((address, address, uint256, uint256, bool, uint256, uint256, uint256, uint256)[] memory)",
        params: [marketAddress],
      });

      setActiveOrders(convertToOrder(res));
    } catch (error) {
      console.log(error);
    }
  };

  const getGraphData = () => {
    //merge two arrays pending and active
    const mergedArrays = [...activeOrders, ...pendingOrders];

    //sort by createdAt
    const sortedArrays = mergedArrays.sort(
      (a, b) => Number(a.createdAt) - Number(b.createdAt)
    );

    //get create new arrays from sorted array by filtering based on buy or sell
    const buyOrders = sortedArrays
      .filter((order) => order.isBuyOrder === true)
      .map((order) => {
        return {
          createdAt: Number(order.createdAt),
          price: Number(order.price),
        };
      });
    const sellOrders = sortedArrays
      .filter((order) => order.isBuyOrder === false)
      .map((order) => {
        return {
          createdAt: Number(order.createdAt),
          price: Number(order.price),
        };
      });
    setChartData({
      buyOrder: buyOrders,
      sellOrder: sellOrders,
    });
  };

  const getHistoricalOrder = async () => {
    try {
      const marketAddress = getSelectedMarketAddress();
      const res = await readContract({
        contract: contractInstance,
        method:
          "function getOrdersFromHistoricalOrders(address token) external view returns ((address, address, uint256, uint256, bool, uint256, uint256, uint256, uint256)[] memory)",
        params: [marketAddress],
      });

      setHistoricalOrders(convertToOrder(res));
    } catch (error) {
      console.log(error);
    }
  };

  const getBalanceOfToken = async () => {
    try {
      if (createOrder.type === "Buy") {
        const res = await readContract({
          contract: usdcContractInstance,
          method:
            "function balanceOf(address _owner) public view returns (uint256 balance)",
          params: [wallet.getAccount().address],
        });
        setUserTokenBalance(res);
      }
      if (createOrder.type === "Sell") {
        const marketAddress = getSelectedMarketAddress();
        const sellTokenContractInstance = createTokenInstance(marketAddress);
        const res = await readContract({
          contract: sellTokenContractInstance,
          method:
            "function balanceOf(address _owner) public view returns (uint256 balance)",
          params: [wallet.getAccount().address],
        });
        console.log("token balance", sellTokenContractInstance, res);
        setUserTokenBalance(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const mintToken = async () => {
    try {
      if (createOrder.type === "Buy") {
        var tx = prepareContractCall({
          contract: usdcContractInstance,
          method: "function mint(address account, uint256 amount)",
          params: [wallet.getAccount().address, BigInt(100)],
        });
        var res = await sendAndConfirmTransaction({
          transaction: tx,
          account: wallet.getAccount(),
        });
        if (res.status) {
          toast.success("Token minted successfully");
        } else {
          toast.error("unable to mint token");
        }
      } else {
        const marketAddress = getSelectedMarketAddress();
        const sellTokenContractInstance = createTokenInstance(marketAddress);
        var tx = prepareContractCall({
          contract: sellTokenContractInstance,
          method: "function mint(address account, uint256 amount)",
          params: [wallet.getAccount().address, BigInt(10)],
        });
        var res = await sendAndConfirmTransaction({
          transaction: tx,
          account: wallet.getAccount(),
        });
        if (res.status) {
          toast.success("Token minted successfully");
        } else {
          toast.error("unable to mint token");
        }
      }
    } catch (error) {
      toast.error("unable to mint token");
    }
  };

  useEffect(() => {
    if (contractInstance == null) return;
    const callGetBalanceOfTokens = async () => {
      await getBalanceOfToken();
    };
    callGetBalanceOfTokens();
  }, [createOrder.price, selectedMarket]);

  useEffect(() => {
    connectWallet();
    const interval = setInterval(() => {
      fetchData();
    }, 6000);
    return () => clearInterval(interval);

  }, []);

  const fetchData = async () => {
    if (wallet == null) return;
    await Promise.allSettled([
      getActiveOrCurrentOrder(),
      getHistoricalOrder(),
      getPendingOrder(),
    ]).then(() => {
      getGraphData();
    });
  };


  setInterval(() => {
    fetchData();
  }, 8000);

  if (isConnecting) {
    return (
      <div className="h-screen w-screen flex justify-center items-center bg-black">
        <Spinner
          color="yellow"
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#09090B]">
      <ToastContainer position="bottom-right" theme="dark" />

      {/* //navbar */}

      <div className="w-full flex justify-between items-center shadow-lg h-20 p-3">
        {/* //project title div */}
        <div className="w-[250px] flex gap-1 justify-center p-2 rounded-md">
          <img src={logo} alt="logo" />
        </div>

        {/* //2 buttons */}

        <div className="flex gap-4">
          <Button
            className="bg-primary font-semibold text-black"
            onClick={() => mintToken()}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
            placeholder={undefined}
          >
            Faucet
          </Button>
          {wallet != null ? (
            // <Badge color="green">
            <Button
              className="bg-primary w-[200px] font-semibold"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder={undefined}
            >
              <p className="truncate text-secondary-text">
                {wallet.getAccount().address}{" "}
              </p>
            </Button>
          ) : (
            // </Badge>
            <Button
              className="bg-primary font-semibold text-secondary-text"
              onClick={connectWallet}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder={undefined}
            >
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <Menu>
            <MenuHandler>
              <Button
                className="inline-flex items-center gap-2"
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
                placeholder={undefined}
              >
                Switch Network <FaChevronDown />{" "}
              </Button>
            </MenuHandler>
            <MenuList
              className="bg-[#0C0A09] border border-white/10"
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              placeholder={undefined}
            >
              {Array.from(supportedChains.keys()).map((chain, index) => (
                <MenuItem
                  key={index}
                  onClick={() =>
                    switchChain(supportedChains.get(chain).chain.name)
                  }
                  className="bg-gray-900 mb-2 py-4 px-2"
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  placeholder={undefined}
                >
                  {chain}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </div>
      </div>

      <div className="w-full flex">
        {/* market selection section */}
        <div className="w-2/3 p-8 flex flex-col gap-4">
          <MarketSelector
            selectedMarket={selectedMarket}
            setSelectedMarket={setSelectedMarket}
          />
          <CurrentMarket />
          <OrderBook
            activeOrders={activeOrders}
            pendingOrders={pendingOrders}
          />
          <HistoricalOrders historicalOrders={historicalOrders} />
        </div>
        <div className="w-1/3">
          <CreateOrder
            createOrder={createOrder}
            setCreateOrder={setCreateOrder}
            createBuyOrder={createBuyOrder}
            createSellOrder={createSellOrder}
            isOrderLoading={isOrderLoading}
            isApprovalLoading={isApprovalLoading}
            userTokenBalance={userTokenBalance}
            getApproval={() => {
              if (createOrder.type === "Buy") {
                return getApproval(usdcContractInstance);
              } else {
                const marketAddress = getSelectedMarketAddress();
                const sellTokenContractInstance =
                  createTokenInstance(marketAddress);
                return getApproval(sellTokenContractInstance);
              }
            }}
            SelectedMarket={selectedMarket}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
