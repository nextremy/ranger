import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

type Props = { roundedFull?: boolean } & ComponentPropsWithoutRef<"input">;

export const TextInput = forwardRef(function TextInput(
  { roundedFull, className, ...restProps }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={`h-12 bg-gray-300 ${
        roundedFull ? "rounded-full px-6" : "rounded-md px-4"
      } ${className}`}
      {...restProps}
      ref={ref}
    />
  );
});
