import Link from "next/link"

const tools = [
  { href: "/tools/job-search", label: "Job Search" },
  { href: "/tools/resume-builder", label: "Resume Builder" },
  { href: "/tools/image-compressor", label: "Image Compressor" },
  { href: "/tools/image-converter", label: "Image Converter" },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center" aria-label="Yelvantix home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/yelvantix-logo.jpg"
                alt="Yelvantix logo"
                width={140}
                height={36}
                style={{ width: "auto", height: "36px" }}
              />
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Free online tools to boost your productivity. No login required, no hidden fees. Just fast, reliable tools for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Tools
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link
                    href={tool.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              About
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  100% Free to Use
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  No Account Required
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Privacy Friendly
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="text-center text-xs text-muted-foreground">
            {`\u00A9 ${new Date().getFullYear()} Yelvatix. All rights reserved. All tools are free and open for everyone.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
