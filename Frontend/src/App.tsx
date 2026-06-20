import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../src/contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { DarkModeProvider } from "./contexts/DarkmodeContext";
import MainLayout from "./components/layout/MainLayout";
import ProjectPage from "./pages/ProjectPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/HomePage";

function App() {
  return (
    <ThemeProvider>
      <DarkModeProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="projects/:slug" element={<ProjectPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
      </DarkModeProvider>
    </ThemeProvider>
  );
}

export default App;
