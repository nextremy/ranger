import { ComponentPropsWithoutRef, ForwardedRef, forwardRef } from "react";

type Props = ComponentPropsWithoutRef<"textarea">;

export const TextArea = forwardRef(function TextArea(
  { className, ...restProps }: Props,
  ref: ForwardedRef<HTMLTextAreaElement>,
) {
  return (
    <textarea
      className={`h-48 rounded-md bg-gray-300 p-4 ${className}`}
      {...restProps}
      ref={ref}
    />
  );
});
