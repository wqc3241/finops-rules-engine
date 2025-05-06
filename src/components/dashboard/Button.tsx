
import { Button as ShadcnButton } from "@/components/ui/button";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

const Button = ({ children, onClick, variant = "default", size = "default", className = "" }: ButtonProps) => {
  return (
    <ShadcnButton
      variant={variant}
      size={size}
      onClick={onClick}
      className={className}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
