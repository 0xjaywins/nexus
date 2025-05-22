"use client";

import type * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

interface PopoverProviderProps {
  children: React.ReactNode;
}

export function PopoverProvider({ children }: PopoverProviderProps) {
  return <PopoverPrimitive.Root>{children}</PopoverPrimitive.Root>;
}
