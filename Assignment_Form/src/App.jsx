import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RouterConfig from "./components/Pages/RouterConfig";

function App() {
  return (
    <div>
      <RouterConfig />
      <ToastContainer />
    </div>
  );
}

export default App;
