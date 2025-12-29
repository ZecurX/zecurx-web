"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const isDark = theme === "dark"

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative flex h-9 w-16 items-center rounded-full bg-muted/80 p-1 ring-1 ring-border transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Toggle theme"
        >
            <span className="sr-only">Toggle theme</span>

            {/* Track Icons */}
            <div className="flex w-full justify-between px-2 text-xs">
                <Sun className="h-4 w-4 text-muted-foreground opacity-50 transition-opacity" />
                <Moon className="h-4 w-4 text-muted-foreground opacity-50 transition-opacity" />
            </div>

            {/* Sliding Thumb */}
            <span
                className={cn(
                    "absolute left-1 flex h-7 w-7 items-center justify-center rounded-full bg-background shadow-md ring-1 ring-border transition-transform duration-300",
                    isDark ? "translate-x-7" : "translate-x-0"
                )}
            >
                {isDark ? (
                    <Moon className="h-4 w-4 text-foreground" />
                ) : (
                    <Sun className="h-4 w-4 text-orange-500" />
                )}
            </span>
        </button>
    )
}
