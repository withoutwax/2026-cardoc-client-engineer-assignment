import { RelayEnvironmentProvider } from "react-relay";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Environment from "./relay/RelayEnvironment";
import SearchPage from "./components/SearchPage";
import "./App.css";

import { BookmarkProvider } from "./contexts/BookmarkContext";

function App() {
  return (
    <RelayEnvironmentProvider environment={Environment}>
      <BookmarkProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </BookmarkProvider>
    </RelayEnvironmentProvider>
  );
}

export default App;
