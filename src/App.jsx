import "./App.css";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Background from "./components/Background";

import Home from "./pages/Home";
import Learn from "./pages/Learn";
import Career from "./pages/Career";
import Progress from "./pages/Progress";
import Saved from "./pages/Saved";

import Auth from "./pages/Auth";
import Profile from "./pages/Profile";


function ProtectedRoute({ children }) {

  const authenticated =
    localStorage.getItem(
      "careermatch-auth"
    ) === "true";

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}


function AppLayout() {
  return (
    <div className="app">

      <Background />

      <Navbar />

      <main className="main">

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/learn"
            element={<Learn />}
          />

          <Route
            path="/career"
            element={<Career />}
          />

          <Route
            path="/progress"
            element={<Progress />}
          />

          <Route
            path="/saved"
            element={<Saved />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Routes>

      </main>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <div className="app">

        <Background />

        <Navbar />

        <main className="page-container">

          <Routes>

            <Route path="/" element={<Home />} />

            <Route
              path="/learn"
              element={<Learn />}
            />

            <Route
              path="/career"
              element={<Career />}
            />

            <Route
              path="/progress"
              element={<Progress />}
            />

            <Route
              path="/saved"
              element={<Saved />}
            />
            <Route
  path="/profile"
  element={<Profile />}/>


          </Routes>

        </main>

      </div>

    </BrowserRouter>
  );
}

export default App;