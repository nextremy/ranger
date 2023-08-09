import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<"input">;

export const TextInput = forwardRef(function TextInput(
  { className, ...restProps }: Props,
  ref: ForwardedRef<HTMLInputElement>,
) {
  return (
    <input
      className={`mt-1 h-12 rounded-md bg-gray-300 px-4 ${className}`}
      {...restProps}
      ref={ref}
    />
  );
});
