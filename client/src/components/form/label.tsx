import { ComponentPropsWithoutRef, ReactNode } from "react";

type Props = {
  children: ReactNode;
} & ComponentPropsWithoutRef<"label">;

export function Label({ children, className, ...restProps }: Props) {
  return (
    <label
      className={`mt-4 text-sm font-semibold tracking-wide ${className}`}
      {...restProps}
    >
      {children}
    </label>
  );
}
