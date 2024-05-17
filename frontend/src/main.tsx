import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ThirdwebProvider } from "thirdweb/react";
import { ChartDataProvider } from "./context/chartDataContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThirdwebProvider>
    <ChartDataProvider>
      <App />
    </ChartDataProvider>
  </ThirdwebProvider>
);
