import { Role } from "@/types/auth";
import { ROLE_DISPLAY_NAMES } from "@/lib/permissions";
import { cn } from "@/lib/utils";

interface RoleBadgeProps {
    role: Role;
    size?: "sm" | "md" | "lg";
    className?: string;
}

const ROLE_COLORS: Record<Role, string> = {
    super_admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    sales: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    marketing: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
    media: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const SIZE_CLASSES = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
};

export function RoleBadge({ role, size = "md", className }: RoleBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center font-medium rounded-full",
                ROLE_COLORS[role],
                SIZE_CLASSES[size],
                className
            )}
        >
            {ROLE_DISPLAY_NAMES[role]}
        </span>
    );
}
