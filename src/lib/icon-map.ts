import {
  TrendingUp,
  Megaphone,
  Handshake,
  CheckCircle,
  Users,
  Wrench,
  Wallet,
  Scale,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Home,
  KeyRound,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Handshake,
  CheckCircle,
  Users,
  Wrench,
  Wallet,
  Scale,
  BarChart3,
  PieChart,
  Target,
  Globe,
  Home,
  KeyRound,
  Building2,
};

export function getIcon(name: string): LucideIcon {
  return ICON_MAP[name] ?? Home;
}

export { ICON_MAP };
export type { LucideIcon };
