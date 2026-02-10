interface AdBannerProps {
  slot?: string
  format?: "horizontal" | "vertical" | "rectangle"
  className?: string
}

const sizeMap = {
  horizontal: "min-h-[90px] w-full",
  vertical: "min-h-[600px] w-[160px]",
  rectangle: "min-h-[250px] w-full max-w-[336px]",
}

export function AdBanner({ format = "horizontal", className = "" }: AdBannerProps) {
  return (
    <aside
      className={`flex items-center justify-center rounded-lg border border-dashed border-border bg-muted/50 ${sizeMap[format]} ${className}`}
      aria-label="Advertisement"
      role="complementary"
    >
      <p className="text-xs text-muted-foreground">Ad Space</p>
    </aside>
  )
}
