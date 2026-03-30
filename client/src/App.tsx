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
      <Route path="/subscribe" component={Subscribe} />
      <Route path="/subscriptions" component={Subscriptions} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/studio" component={Studio} />
      <Route path="/faq" component={FAQ} />
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
