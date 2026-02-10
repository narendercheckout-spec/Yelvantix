import { Zap, Shield, Smartphone, Globe } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "All tools run client-side for instant results. No waiting for server processing.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your data stays on your device. We never upload, store, or share your files.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Fully responsive design works perfectly on any device, any screen size.",
  },
  {
    icon: Globe,
    title: "Always Free",
    description: "No hidden costs, no premium tiers, no account walls. Every tool is completely free.",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-background py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl text-balance">
            Why Choose Yelvatix
          </h2>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Built for speed, privacy, and ease of use. Here is what makes our tools different.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-heading text-base font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
