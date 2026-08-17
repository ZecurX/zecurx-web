import { Metadata } from "next";
import EditorialHeader from "@/components/editorial/EditorialHeader";
import EditorialFooter from "@/components/editorial/EditorialFooter";
import ImageWithFallback from "@/components/editorial/ImageWithFallback";

export const metadata: Metadata = {
  title: "About Us | ZecurX",
  description:
    "ZecurX is a multi-disciplinary collective of cryptographers, behavioral psychologists, and system designers building security that respects the end-user.",
  alternates: {
    canonical: "https://zecurx.com/about",
  },
};

const team = [
  {
    name: "Elena Rostova",
    role: "Chief Strategy Officer",
    shape: "rounded-full",
    img: "https://lh3.googleusercontent.com/aida/AP1WRLuVlt3XewdHwSXP-KWUXZf5RWyX04HDg5xAikGjD-InWL7Vj6p7OUyPqWTUhXFGvO39td9cF7ixOGrAJ8znLn2nuAzSzSpWoyDQWOQA8x1Nv0ERb7Mahfcr-vUHl9Ey2JvQBMd53JlGe07urEyJSsWc6nZC5gvP5gFiLwnPZdWRf61ywcw9DUen06NvSmp1II3lJvP-OLmfsB7PnoUbr0s9Qv8dopntMDSZN9zoJ9Bd1OaUUAygylZ_pKo",
  },
  {
    name: "David Chen",
    role: "Head of Cryptography",
    shape: "rounded-t-full rounded-bl-full rounded-br-3xl",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCfRuOKFTw2x9_DTvCw-SOHYTgiGOPuUdeamjl0K_a5azJvy2cfYPYAzgyxlci0l6fLUCO15Lm3Qcmr10bGszMVQtzoidclbuzYufw5C18OF7Rxk61QYlAPeKsgZaBpYla5Dzt8JeqdTGGTAysW2jaUcajZ8_EZeb0SrQBZo4Qgh3cBRMUAxiNkTWaAZAgCR_Wv30RAm_6i0jZWx3gdktF814zeZ1IB3eG4tyrIcNN6puLWN10rxB1f",
  },
  {
    name: "Sarah Jenkins",
    role: "VP of Operations",
    shape: "rounded-b-full rounded-tl-full rounded-tr-3xl",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD85laAPpiBbkm_dLYRa1bpbAyH4ZWJIIXo9l4frtYwfsMthpmflVssssy6GIhoLNQ5bY_kqKOzbwhrhnRomRfmlpz_lkUAnYPH11BaL7QqSmQZVrdh9dWABKf8sjussmYZJAGujXmGmXNFLpbC_13KPQfKmrCJFeqggNV5Q7E7Qyk7F-dVP7yAYK2AYSRVbrtjwIQwHZDX7M0hlEiH7LqJO3H0ox3ELyFOZqRat8IUzABclDMtMZvP",
  },
];

const timeline = [
  {
    year: "2018",
    title: "The Inception",
    desc: "Founded on the principle that digital security required a structural redesign, focusing on usability over restrictions.",
  },
  {
    year: "2021",
    title: "Quantum Resilience",
    desc: "Deployed our first quantum-resistant architecture, securing over $50B in client assets across global markets.",
  },
  {
    year: "2024",
    title: "Global Expansion",
    desc: "Opening our European hub and launching the Zecurx Academy to train the next generation of security architects.",
  },
];

export default function AboutPage() {
  return (
    <div className="zx-editorial min-h-screen bg-[color:var(--zx-background)] text-[color:var(--zx-on-background)] font-manrope">
      <EditorialHeader active="about" />

      <main className="w-full pt-20">
        {/* Hero */}
        <section className="relative w-full pt-32 pb-24 px-5 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center bg-[color:var(--zx-primary-fixed)]">
          <div className="max-w-4xl space-y-8 relative">
            <h1 className="font-libre-caslon text-[40px] md:text-[64px] leading-[1.1] tracking-tight text-[color:var(--zx-on-surface)]">
              Security, Reimagined
            </h1>
            <p className="text-lg leading-relaxed text-[color:var(--zx-on-surface-variant)] max-w-2xl mx-auto">
              We believe that true protection isn&apos;t about building higher walls, but forging smarter
              connections. We&apos;re replacing the legacy of fear with a culture of sophisticated resilience.
            </p>
            <div className="pt-8 flex justify-center gap-6 opacity-60">
              <div className="h-16 w-px bg-[color:var(--zx-outline-variant)]/50" />
            </div>
          </div>
        </section>

        {/* Narrative */}
        <section className="w-full px-5 md:px-12 lg:px-24 py-[80px] md:py-[120px] bg-[color:var(--zx-surface-container)] relative overflow-hidden">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 relative z-10">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-[color:var(--zx-surface-variant)]/50 backdrop-blur-md border border-[color:var(--zx-inverse-surface)]/10">
                <img
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 hover:opacity-100 transition-opacity duration-700"
                  alt="Abstract art depicting a glass sphere shielding a softly glowing core, symbolizing fragile data protected by robust security."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC0WqlmxuDDbcNFrMQbS6BgK23dZcYYkiMMmPIZrRKRospPd-mNASVB_YYiF67HAVlDHhAkxXdkzjX2jS6V60f2ihqYtjwC03W-bFKCU4gY-64ljYO4uyW0zuwG9v1iujq-lvHaT7z0HFa6NkXFNe1ytZzO-g0qrKYDKVaj3cObH6sor_tFpN2FaL-Gc5Hgr9QMJ4ULL3biJZU0LiktqbTyl1u_DbdTS05JWGwmMBuHU6COAPxRQc85"
                />
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7 space-y-12 relative z-10">
              <div className="space-y-4">
                <span className="font-manrope text-[12px] font-semibold text-[color:var(--zx-tertiary)] uppercase tracking-[0.1em]">
                  Our Philosophy
                </span>
                <h2 className="font-libre-caslon text-[32px] leading-[1.3] text-[color:var(--zx-on-surface)]">
                  Human-First Architecture
                </h2>
              </div>
              <div className="space-y-6 leading-relaxed text-[color:var(--zx-on-surface-variant)]">
                <p>
                  The cybersecurity industry has long relied on intimidation. Red alerts, flashing alarms, and a
                  constant narrative of imminent threat. At Zecurx, we fundamentally reject this paradigm.
                </p>
                <p>
                  We design security protocols that respect the end-user. By reducing friction and cognitive load,
                  we empower teams to operate securely without feeling hindered. It is an approach that values
                  human behavior as much as cryptographic strength.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div className="space-y-2">
                  <div className="font-libre-caslon text-[40px] text-[color:var(--zx-primary)] font-bold">
                    98%
                  </div>
                  <div className="font-manrope text-[12px] text-[color:var(--zx-on-surface-variant)] uppercase tracking-[0.1em]">
                    Threat Mitigation
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="font-libre-caslon text-[40px] text-[color:var(--zx-tertiary)] font-bold">
                    Zero
                  </div>
                  <div className="font-manrope text-[12px] text-[color:var(--zx-on-surface-variant)] uppercase tracking-[0.1em]">
                    Friction Adjudication
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="w-full px-5 md:px-12 lg:px-24 py-[80px] md:py-[120px] bg-[color:var(--zx-surface)]">
          <div className="max-w-[1280px] mx-auto space-y-24">
            <div className="text-center space-y-6 max-w-3xl mx-auto">
              <h2 className="font-libre-caslon text-[32px] text-[color:var(--zx-on-surface)]">The Architects</h2>
              <p className="text-[color:var(--zx-on-surface-variant)]">
                A multi-disciplinary collective of cryptographers, behavioral psychologists, and system designers
                united by a single vision.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 lg:gap-24">
              {team.map((member, i) => (
                <div
                  key={member.name}
                  className={`group flex flex-col items-center text-center space-y-6 ${i === 1 ? "lg:mt-16" : ""}`}
                >
                  <div
                    className={`w-64 h-64 overflow-hidden bg-[color:var(--zx-surface-variant)]/30 backdrop-blur-sm p-2 transition-all duration-500 ${member.shape}`}
                  >
                    <div className={`w-full h-full overflow-hidden ${member.shape}`}>
                      <ImageWithFallback
                        src={member.img}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-700 transform group-hover:scale-105"
                        fallback={
                          <div className="w-full h-full flex items-center justify-center bg-[color:var(--zx-primary-fixed)]">
                            <span className="font-libre-caslon text-[56px] text-[color:var(--zx-on-primary-fixed)]">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-libre-caslon text-[24px] text-[color:var(--zx-on-surface)]">
                      {member.name}
                    </h3>
                    <p className="font-manrope text-[12px] text-[color:var(--zx-tertiary)] uppercase tracking-[0.1em] mt-2">
                      {member.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="w-full px-5 md:px-12 lg:px-24 py-[80px] md:py-[120px] bg-[color:var(--zx-surface-container-low)] relative">
          <div className="max-w-4xl mx-auto space-y-24 relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[color:var(--zx-outline-variant)]/40 to-transparent -translate-x-1/2" />
            <div className="text-center pb-12">
              <h2 className="font-libre-caslon text-[32px] text-[color:var(--zx-on-surface)]">Evolution of Trust</h2>
            </div>
            {timeline.map((item, i) => {
              const alignRight = i % 2 === 0;
              return (
                <div key={item.year} className="relative flex flex-col md:flex-row items-start md:items-center justify-between group">
                  <div className="absolute left-8 md:left-1/2 w-3 h-3 rounded-full bg-[color:var(--zx-surface)] border border-[color:var(--zx-tertiary)] -translate-x-1/2 mt-2 md:mt-0 group-hover:bg-[color:var(--zx-tertiary)] transition-colors duration-300" />
                  {alignRight ? (
                    <>
                      <div className="w-full md:w-[45%] pl-20 md:pl-0 text-left md:text-right pr-0 md:pr-12">
                        <TimelineCopy item={item} />
                      </div>
                      <div className="w-full md:w-[45%] hidden md:block pl-12">
                        <div className="h-px w-24 bg-[color:var(--zx-outline-variant)]/30 group-hover:bg-[color:var(--zx-tertiary)]/50 transition-colors" />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-full md:w-[45%] hidden md:flex md:justify-end md:items-center text-right pr-12">
                        <div className="h-px w-24 bg-[color:var(--zx-outline-variant)]/30 group-hover:bg-[color:var(--zx-tertiary)]/50 transition-colors" />
                      </div>
                      <div className="w-full md:w-[45%] pl-20 md:pl-12 text-left">
                        <TimelineCopy item={item} />
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <EditorialFooter />
    </div>
  );
}

function TimelineCopy({ item }: { item: { year: string; title: string; desc: string } }) {
  return (
    <>
      <div className="font-libre-caslon text-[32px] text-[color:var(--zx-primary)]/50 group-hover:text-[color:var(--zx-primary)] transition-colors">
        {item.year}
      </div>
      <h3 className="font-libre-caslon text-[20px] text-[color:var(--zx-on-surface)] mt-2">{item.title}</h3>
      <p className="text-[color:var(--zx-on-surface-variant)] mt-3">{item.desc}</p>
    </>
  );
}
