import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { Navigation } from "./components/Navigation";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Collections from "./pages/Collections";
import About from "./pages/About";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { useState } from "react";

function Router() {
  const [, setLocation] = useLocation();
  const [adminSession, setAdminSession] = useState<{ adminId: number; username: string } | null>(null);

  const handleAdminClick = () => {
    if (!adminSession) {
      setLocation("/admin/login");
    }
  };

  const handleAdminLogout = () => {
    setAdminSession(null);
    setLocation("/");
  };

  return (
    <>
      <Navigation onAdminClick={handleAdminClick} />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shop" component={Shop} />
        <Route path="/collections" component={Collections} />
        <Route path="/about" component={About} />
        <Route path="/admin/login">
          {() => <AdminLogin onLoginSuccess={(session) => {
            setAdminSession(session);
            setLocation("/admin/dashboard");
          }} />}
        </Route>
        <Route path="/admin/dashboard">
          {() => adminSession ? (
            <AdminDashboard session={adminSession} onLogout={handleAdminLogout} />
          ) : (
            <AdminLogin onLoginSuccess={(session) => {
              setAdminSession(session);
              setLocation("/admin/dashboard");
            }} />
          )}
        </Route>
        <Route path="/404" component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook
// - This app uses light theme with elegant neutral palette

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
