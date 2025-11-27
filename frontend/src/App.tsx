import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import { Toaster } from "sonner";
import AuthSuccess from "./pages/AuthSuccess";

function App() {
  return (
    <>
    <Toaster richColors/>

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<SignInPage />}/>
        <Route path="/register" element={<SignUpPage />}/>
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;