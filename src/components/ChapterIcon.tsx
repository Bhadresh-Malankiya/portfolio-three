import {
  Sprout,
  GraduationCap,
  Code2,
  Building2,
  Activity,
  Terminal,
  TrendingUp,
  FileSpreadsheet,
  Sparkles,
  Inbox,
  Flame,
  BarChart3,
  Users,
  Compass,
  type LucideProps,
} from "lucide-react";
import type { ChapterIcon as ChapterIconKey } from "@/data/chapters";

const ICONS: Record<ChapterIconKey, React.ComponentType<LucideProps>> = {
  sprout: Sprout,
  "graduation-cap": GraduationCap,
  code: Code2,
  building: Building2,
  activity: Activity,
  terminal: Terminal,
  "trending-up": TrendingUp,
  sheet: FileSpreadsheet,
  sparkles: Sparkles,
  inbox: Inbox,
  flame: Flame,
  chart: BarChart3,
  users: Users,
  compass: Compass,
};

export default function ChapterIcon({ icon, ...props }: { icon: ChapterIconKey } & LucideProps) {
  const Icon = ICONS[icon];
  return <Icon {...props} />;
}
