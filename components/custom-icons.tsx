import React from "react";
import { IconType } from "@icons-pack/react-simple-icons";

interface CustomIconProps extends React.SVGProps<SVGSVGElement> {
  size?: string | number;
  title?: string;
}

export const SiXai = React.forwardRef<SVGSVGElement, CustomIconProps>(
  ({ color = "currentColor", size = 24, title, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        role="img"
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        {...props}
      >
        {title && <title>{title}</title>}
        <path d="m3.005 8.858 8.783 12.544h3.904L6.908 8.858zM6.905 15.825 3 21.402h3.907l1.951-2.788zM16.585 2l-6.75 9.64 1.953 2.79L20.492 2zM17.292 7.965v13.437h3.2V3.395z" />
      </svg>
    );
  }
) as IconType;
