import { Children, useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { Button } from "./components/ui/button";
import "./App.css";
import { BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import Auth from "./pages/auth/Auth";
import Chat from "./pages/chat/Chat";
import Profile from "./pages/profile/Profile";
import { useAppStore } from "./store";
import { apiClient } from "./lib/api-client";
import { USER_INFO_ROUTE } from "./utils/constants";
import { Cookie } from "lucide-react";

function App() {
  const { userInfo, setUserInfo } = useAppStore();
  const [loading, setloading] = useState(true);
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await apiClient.get(USER_INFO_ROUTE, {
          withCredentials: true,
        });

        console.log(response.data);
        if (response.status === 200 && response.data.id) {
          setUserInfo(response.data);
        } else {
          setUserInfo(undefined);
        }
      } catch (error) {
        setUserInfo(undefined);
      } finally {
        setloading(false);
      }
    };

    if (!userInfo) {
      getUserData();
    } else {
      setloading(false);
    }
  }, [userInfo, setUserInfo]);

  if (loading) {
    return <div>loading......</div>;
  }

  const Privateroute = ({ children }) => {
    const { userInfo } = useAppStore();
    const authenticated = !!userInfo;
    return authenticated ? children : <Navigate to="/auth" />;
  };

  const Authroute = ({ children }) => {
    const { userInfo } = useAppStore();
    const authenticated = !!userInfo;
    return authenticated ? <Navigate to="/chat"/> : children;
  };
  return (
    <div>
      <Routes>
        <Route
          path="/auth"
          element={
            <Authroute>
              <Auth />
            </Authroute>
          }
        />

        <Route
          path="/chat"
          element={
            <Privateroute>
              <Chat />
            </Privateroute>
          }
        />

        <Route
          path="/profile"
          element={
            <Privateroute>
              <Profile />
            </Privateroute>
          }
        />

        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </div>
  );
}

export default App;
