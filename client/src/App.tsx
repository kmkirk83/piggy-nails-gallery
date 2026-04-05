import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/LuxuryHome";
import Gallery from "./pages/Gallery";
import Subscribe from "./pages/Subscribe";
import Subscriptions from "./pages/Subscriptions";
import Checkout from "./pages/Checkout";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Account from "./pages/Account";
import Admin from "./pages/Admin";
import Studio from "./pages/Studio";
import FAQ from "./pages/FAQ";
import FinancialDashboard from "./pages/FinancialDashboard";
import NotificationCenter from "./pages/NotificationCenter";
import NotificationPreferences from "./pages/NotificationPreferences";
import Products from "./pages/Products";
import AdminDashboard from "./pages/AdminDashboard";
import SocialMediaSetup from "./pages/SocialMediaSetup";
import MarketingDashboard from "./pages/MarketingDashboard";
import OrderTracking from "./pages/OrderTracking";
import MonitoringDashboard from "./pages/MonitoringDashboard";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"\\"} component={Home} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/shop"} component={Shop} />
      <Route path={"/product/:productId"} component={ProductDetail} />
      <Route path="/account" component={Account} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/social-media-setup" component={SocialMediaSetup} />
      <Route path="/marketing" component={MarketingDashboard} />
      <Route path="/orders" component={OrderTracking} />
      <Route path="/monitoring" component={MonitoringDashboard} />
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/studio" component={Studio} />
      <Route path="/faq" component={FAQ} />
      <Route path="/products" component={Products} />
      <Route path="/financial" component={FinancialDashboard} />
      <Route path="/notifications" component={NotificationCenter} />
      <Route path="/account/notification-preferences" component={NotificationPreferences} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

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
