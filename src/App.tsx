import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import AdminGuard from "@/components/AdminGuard";
import ResellerGuard from "@/components/ResellerGuard";
import SubscriptionGuard from "@/components/SubscriptionGuard";

// Public pages
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscribeCheckoutPage from "./pages/SubscribeCheckoutPage";
import SuccessPage from "./pages/SuccessPage";
import SearchPage from "./pages/SearchPage";
import SupportPage from "./pages/SupportPage";
import ResellerApplyPage from "./pages/ResellerApplyPage";
import NotFound from "./pages/NotFound";

// User dashboard
import DashboardLayout from "./pages/DashboardLayout";
import DashboardPage from "./pages/DashboardPage";
import OrdersPage from "./pages/OrdersPage";
import FavoritesPage from "./pages/FavoritesPage";
import RecentPage from "./pages/RecentPage";
import DashboardSubscriptionPage from "./pages/DashboardSubscriptionPage";
import AppsPage from "./pages/AppsPage";
import InvoicesPage from "./pages/InvoicesPage";
import LicensesPage from "./pages/LicensesPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import RefundsPage from "./pages/RefundsPage";

// User dashboard sub-pages
import ProfilePage from "./pages/dashboard/ProfilePage";
import BillingPage from "./pages/dashboard/BillingPage";
import NotificationsPage from "./pages/dashboard/NotificationsPage";
import SecurityPage from "./pages/dashboard/SecurityPage";

// App access (subscription-gated)
import AppAccessPage from "./pages/AppAccessPage";

// Reseller
import ResellerLayout from "./pages/ResellerLayout";
import ResellerDashboardPage from "./pages/ResellerDashboardPage";
import ResellerUsersPage from "./pages/ResellerUsersPage";
import ResellerLeadsPage from "./pages/ResellerLeadsPage";
import ResellerPipelinePage from "./pages/ResellerPipelinePage";
import ResellerContactsPage from "./pages/ResellerContactsPage";
import ResellerSubscriptionsPage from "./pages/ResellerSubscriptionsPage";
import ResellerProductsPage from "./pages/ResellerProductsPage";
import ResellerEarningsPage from "./pages/ResellerEarningsPage";
import ResellerSettingsPage from "./pages/ResellerSettingsPage";
import ResellerCommissionsPage from "./pages/reseller/ResellerCommissionsPage";
import ResellerReportsPage from "./pages/reseller/ResellerReportsPage";
import ResellerMarketingPage from "./pages/reseller/ResellerMarketingPage";
import ResellerPayoutsHistoryPage from "./pages/reseller/ResellerPayoutsHistoryPage";

// Admin
import AdminLayout from "./pages/AdminLayout";
import AdminGalleryPage from "./pages/AdminGalleryPage";
import AdminProductsPage from "./pages/AdminProductsPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminSubscriptionsPage from "./pages/AdminSubscriptionsPage";
import OverviewPage from "./pages/OverviewPage";
import UsersPage from "./pages/UsersPage";
import RevenuePage from "./pages/RevenuePage";
import LogsPage from "./pages/LogsPage";
import AlertsPage from "./pages/AlertsPage";
import InfrastructurePage from "./pages/InfrastructurePage";
import MetricsPage from "./pages/MetricsPage";
import TracesPage from "./pages/TracesPage";
import DashboardsPage from "./pages/DashboardsPage";
import SettingsPage from "./pages/SettingsPage";
import VendorsPage from "./pages/admin/VendorsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import CouponsPage from "./pages/admin/CouponsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import EmailTemplatesPage from "./pages/admin/EmailTemplatesPage";
import ChartsQAPage from "./pages/admin/ChartsQAPage";
import { products } from "@/lib/marketplaceData";

// Author Studio
import AuthorLayout from "./pages/AuthorLayout";
import {
  AuthorDashboardPage, AuthorProductsPage, AuthorReleasesPage, AuthorAnalyticsPage,
  AuthorRevenuePage, AuthorLicensesPage, AuthorStoragePage, AuthorDownloadsPage,
  AuthorSeoPage, AuthorReviewsPage, AuthorSupportPage, AuthorDeploymentsPage,
  AuthorAiScansPage, AuthorPayoutsPage, AuthorSettingsPage,
  AuthorUploadCenterPage, AuthorProductUpdatesPage, AuthorCommentsPage,
  AuthorCustomersPage, AuthorFollowersPage, AuthorMarketingPage,
  AuthorAiInsightsPage, AuthorSecurityPage, AuthorTaxInvoicesPage,
  AuthorSalesAnalyticsPage, AuthorRevenueInsightsPage,
} from "./pages/author/AuthorPages";
import {
  AuthorUploadWizardPage, AuthorProfilePage, AuthorNotificationsPage,
  AuthorVerificationPage, AuthorTeamPage, AuthorWorkspacePage,
  AuthorApiKeysPage, AuthorActivityPage, AuthorRankingPage,
  AuthorAffiliatePage, AuthorAchievementsPage,
} from "./pages/author/AuthorPagesExtra";
import {
  AuthorLiveVisitorsPage, AuthorChatCenterPage, AuthorSubscriptionsPage,
  AuthorAiSeoPage, AuthorAiAssistantPage, AuthorDemosPage,
  AuthorChangelogPage, AuthorKycPage, AuthorReputationPage,
  AuthorEmbedsPage, AuthorAbTestsPage, AuthorRoadmapPage,
} from "./pages/author/AuthorPagesPremium";

const queryClient = new QueryClient();

const setMeta = (selector: string, value: string) => {
  const tag = document.head.querySelector(selector);
  if (tag) tag.setAttribute('content', value);
};

const RouteMeta = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const product = pathname.startsWith('/product/')
      ? products.find(p => p.id === pathname.split('/').pop())
      : undefined;
    const title = product ? `${product.name} | SaaSHub` : pathname.startsWith('/admin') ? 'Boss Panel | SaaSHub' : pathname.startsWith('/reseller') ? 'Partner Panel | SaaSHub' : pathname.startsWith('/dashboard') ? 'User Dashboard | SaaSHub' : 'SaaSHub Marketplace';
    const description = product ? product.shortDescription : 'Premium SaaS marketplace with user, reseller, and boss dashboards for apps, orders, reports, and monitoring.';
    document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="twitter:description"]', description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `${window.location.origin}${pathname}`);
  }, [pathname]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <RouteMeta />
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/support" element={<SupportPage />} />
              <Route path="/reseller-apply" element={<ResellerApplyPage />} />

              {/* Category hierarchy (macro, macro/sub, macro/sub/micro) */}
              <Route path="/category/:macro" element={<HomePage />} />
              <Route path="/category/:macro/:sub" element={<HomePage />} />
              <Route path="/category/:macro/:sub/:micro" element={<HomePage />} />

              {/* Product */}
              <Route path="/product/:id" element={<ProductPage />} />

              {/* Cart & Checkout */}
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/subscribe-checkout" element={<SubscribeCheckoutPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/invoices" element={<AuthGuard><InvoicesPage /></AuthGuard>} />
              <Route path="/licenses" element={<AuthGuard><LicensesPage /></AuthGuard>} />
              <Route path="/subscriptions" element={<AuthGuard><SubscriptionsPage /></AuthGuard>} />
              <Route path="/refunds" element={<AuthGuard><RefundsPage /></AuthGuard>} />

              {/* App access — subscription-gated */}
              <Route
                path="/app/:productId"
                element={
                  <SubscriptionGuard>
                    <AppAccessPage />
                  </SubscriptionGuard>
                }
              />

              {/* User dashboard — auth-gated */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <DashboardLayout />
                  </AuthGuard>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="subscription" element={<DashboardSubscriptionPage />} />
                <Route path="favorites" element={<FavoritesPage />} />
                <Route path="recent" element={<RecentPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="billing" element={<BillingPage />} />
                <Route path="invoices" element={<InvoicesPage />} />
                <Route path="licenses" element={<LicensesPage />} />
                <Route path="subscriptions" element={<SubscriptionsPage />} />
                <Route path="refunds" element={<RefundsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="security" element={<SecurityPage />} />
              </Route>

              {/* Reseller — reseller/admin role required */}
              <Route
                path="/reseller"
                element={
                  <ResellerGuard>
                    <ResellerLayout />
                  </ResellerGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<ResellerDashboardPage />} />
                <Route path="leads" element={<ResellerLeadsPage />} />
                <Route path="pipeline" element={<ResellerPipelinePage />} />
                <Route path="contacts" element={<ResellerContactsPage />} />
                <Route path="users" element={<ResellerUsersPage />} />
                <Route path="subscriptions" element={<ResellerSubscriptionsPage />} />
                <Route path="products" element={<ResellerProductsPage />} />
                <Route path="earnings" element={<ResellerEarningsPage />} />
                <Route path="commissions" element={<ResellerCommissionsPage />} />
                <Route path="payouts-history" element={<ResellerPayoutsHistoryPage />} />
                <Route path="marketing" element={<ResellerMarketingPage />} />
                <Route path="reports" element={<ResellerReportsPage />} />
                <Route path="settings" element={<ResellerSettingsPage />} />
              </Route>

              {/* Admin / Boss panel — auth-gated (admin role) */}
              <Route
                path="/admin"
                element={
                  <AdminGuard>
                    <AdminLayout />
                  </AdminGuard>
                }
              >
                <Route index element={<OverviewPage />} />
                <Route path="products" element={<AdminProductsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="reviews" element={<ReviewsPage />} />
                <Route path="coupons" element={<CouponsPage />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="vendors" element={<VendorsPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="subscriptions" element={<AdminSubscriptionsPage />} />
                <Route path="revenue" element={<RevenuePage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="alerts" element={<AlertsPage />} />
                <Route path="apps" element={<AppsPage />} />
                <Route path="infrastructure" element={<InfrastructurePage />} />
                <Route path="metrics" element={<MetricsPage />} />
                <Route path="traces" element={<TracesPage />} />
                <Route path="dashboards" element={<DashboardsPage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="email-templates" element={<EmailTemplatesPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Author Studio — auth-gated */}
              <Route
                path="/author"
                element={
                  <AuthGuard>
                    <AuthorLayout />
                  </AuthGuard>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"   element={<AuthorDashboardPage />} />
                <Route path="products"    element={<AuthorProductsPage />} />
                <Route path="upload"      element={<AuthorUploadCenterPage />} />
                <Route path="upload/new"  element={<AuthorUploadWizardPage />} />
                <Route path="profile"      element={<AuthorProfilePage />} />
                <Route path="notifications" element={<AuthorNotificationsPage />} />
                <Route path="verification" element={<AuthorVerificationPage />} />
                <Route path="team"         element={<AuthorTeamPage />} />
                <Route path="workspace"    element={<AuthorWorkspacePage />} />
                <Route path="api-keys"     element={<AuthorApiKeysPage />} />
                <Route path="activity"     element={<AuthorActivityPage />} />
                <Route path="ranking"      element={<AuthorRankingPage />} />
                <Route path="affiliate"    element={<AuthorAffiliatePage />} />
                <Route path="achievements" element={<AuthorAchievementsPage />} />
                <Route path="updates"     element={<AuthorProductUpdatesPage />} />
                <Route path="releases"    element={<AuthorReleasesPage />} />
                <Route path="analytics"   element={<AuthorAnalyticsPage />} />
                <Route path="sales"       element={<AuthorSalesAnalyticsPage />} />
                <Route path="insights"    element={<AuthorRevenueInsightsPage />} />
                <Route path="revenue"     element={<AuthorRevenuePage />} />
                <Route path="licenses"    element={<AuthorLicensesPage />} />
                <Route path="customers"   element={<AuthorCustomersPage />} />
                <Route path="followers"   element={<AuthorFollowersPage />} />
                <Route path="marketing"   element={<AuthorMarketingPage />} />
                <Route path="comments"    element={<AuthorCommentsPage />} />
                <Route path="ai-insights" element={<AuthorAiInsightsPage />} />
                <Route path="security"    element={<AuthorSecurityPage />} />
                <Route path="tax"         element={<AuthorTaxInvoicesPage />} />
                <Route path="storage"     element={<AuthorStoragePage />} />
                <Route path="downloads"   element={<AuthorDownloadsPage />} />
                <Route path="seo"         element={<AuthorSeoPage />} />
                <Route path="reviews"     element={<AuthorReviewsPage />} />
                <Route path="support"     element={<AuthorSupportPage />} />
                <Route path="deployments" element={<AuthorDeploymentsPage />} />
                <Route path="ai-scans"    element={<AuthorAiScansPage />} />
                <Route path="payouts"     element={<AuthorPayoutsPage />} />
                <Route path="settings"    element={<AuthorSettingsPage />} />
                <Route path="live"          element={<AuthorLiveVisitorsPage />} />
                <Route path="chat"          element={<AuthorChatCenterPage />} />
                <Route path="subscriptions" element={<AuthorSubscriptionsPage />} />
                <Route path="ai-seo"        element={<AuthorAiSeoPage />} />
                <Route path="ai-assistant"  element={<AuthorAiAssistantPage />} />
                <Route path="demos"         element={<AuthorDemosPage />} />
                <Route path="changelog"     element={<AuthorChangelogPage />} />
                <Route path="kyc"           element={<AuthorKycPage />} />
                <Route path="reputation"    element={<AuthorReputationPage />} />
                <Route path="embeds"        element={<AuthorEmbedsPage />} />
                <Route path="ab-tests"      element={<AuthorAbTestsPage />} />
                <Route path="roadmap"       element={<AuthorRoadmapPage />} />
              </Route>

              {/* Catch-all → redirect to home (zero 404) */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
