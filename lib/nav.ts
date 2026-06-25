import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  CreditCard,
  Send,
  Globe,
  Plus,
  RefreshCw,
  TrendingUp,
  Bitcoin,
  Target,
  Landmark,
  Receipt,
  HandCoins,
  Settings,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  group?: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  // Main
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { label: "Accounts", href: "/accounts", icon: Wallet },
  { label: "Cards", href: "/cards", icon: CreditCard },

  // Transfers
  { label: "Local Transfer", href: "/local-transfer", icon: Send, group: "Transfers" },
  { label: "International", href: "/international", icon: Globe, group: "Transfers" },
  { label: "Deposit", href: "/deposit", icon: Plus, group: "Transfers" },
  { label: "Currency Swap", href: "/swap", icon: RefreshCw, group: "Transfers" },

  // Wealth
  { label: "Investments", href: "/investments", icon: TrendingUp, group: "Wealth" },
  { label: "Crypto", href: "/crypto", icon: Bitcoin, group: "Wealth" },
  { label: "Goals & Savings", href: "/goals", icon: Target, group: "Wealth" },

  // Services
  { label: "Loans", href: "/loans", icon: Landmark, group: "Services" },
  { label: "Tax Refund", href: "/tax-refund", icon: Receipt, group: "Services" },
  { label: "Grants", href: "/grants", icon: HandCoins, group: "Services" },

  // Account
  { label: "Settings", href: "/settings/profile", icon: Settings, group: "Account" },
  { label: "Support", href: "/support", icon: LifeBuoy, group: "Account" },
];

// Bottom-nav items for mobile (≤768px).
export const MOBILE_NAV = [
  { label: "Home", href: "/dashboard", icon: LayoutDashboard },
  { label: "Activity", href: "/transactions", icon: ArrowLeftRight },
  { label: "Send", href: "/local-transfer", icon: Send },
  { label: "Cards", href: "/cards", icon: CreditCard },
  { label: "Goals", href: "/goals", icon: Target },
];
