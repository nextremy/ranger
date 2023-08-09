import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export function TopBar({ children }: Props) {
  return <div className="flex h-12 items-center gap-2">{children}</div>;
}
