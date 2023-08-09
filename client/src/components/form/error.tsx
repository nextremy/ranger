import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"p">;

export function Error({ children, className, ...restProps }: Props) {
  return (
    <p
      className={`text-sm font-medium tracking-wide text-red-700 ${className}`}
      {...restProps}
    >
      {children}
    </p>
  );
}
