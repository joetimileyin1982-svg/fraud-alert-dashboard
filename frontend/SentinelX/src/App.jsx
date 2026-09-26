import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import RightPanel from  "../components/layout/RightPanel";
import Dashboard from "../pages/analyst/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="appShell">
      <Sidebar />

      <div className="mainArea">
        <TopBar />
        <div className="pageBody">
          <div className="pageContent">
            <Dashboard />
          </div>
          <RightPanel />
        </div>
      </div>
    </div>
  );
}

export default App;