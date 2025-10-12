import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import MainLayout from "./components/layout/MainLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

// import { Provider } from "react-redux";
// import { store } from "./store/store";

function App() {
  return (
    // -- redux
    // <Provider store={store}>

    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="route1" element={<div>Route 1</div>} />
          <Route path="route1/:id" element={<div>Route id</div>} />

          <Route
            path="route2"
            element={
              <ProtectedRoute>
                <div>Protected Route 2</div>
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AuthProvider>

    // </Provider>
  );
}

export default App;
