import { notFound } from "next/navigation";

export default function AdminShell({ children: _children }: { children: React.ReactNode }) {
  notFound();
}
