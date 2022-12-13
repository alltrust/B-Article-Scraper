
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Error, Register } from "./pages/index";
import {
  Profile,
  Articles,
  ScrapeForm,
  SharedLayout,
} from "./pages/navigation/index";
import ProtectedRoutes from "./pages/navigation/ProtectedRoutes";

function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <SharedLayout />
            </ProtectedRoutes>
          }
        >
          <Route index element={<ScrapeForm />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/articles" element={<Articles />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
