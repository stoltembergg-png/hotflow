"use client";

import * as React from "react";
import { cn, getInitials, stringToColor } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-lg",
};

function Avatar({ src, alt, name, size = "md", className, ...props }: AvatarProps) {
  const [error, setError] = React.useState(false);
  const showImage = src && !error;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden rounded-full",
        sizeMap[size],
        className
      )}
      style={!showImage && name ? { backgroundColor: stringToColor(name) } : undefined}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span className="font-medium text-white">{name ? getInitials(name) : "?"}</span>
      )}
    </div>
  );
}

export { Avatar };
