import type { ReactNode } from "react";
import RealtimeOrderAlerts from "@/components/resha/RealtimeOrderAlerts";

export default function ReshaLayout({ children }: { children: ReactNode }) {
  return <>{children}<RealtimeOrderAlerts /></>;
}
