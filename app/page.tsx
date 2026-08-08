"use client";

import {
  MessageCircle,
  Mic,
  Video,
  ImageIcon,
  FileText,
  ShieldCheck,
  ArrowRight,
  Users,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

const features = [
  {
    title: "Real-time Chat",
    desc: "Messages sync instantly across every device — no refresh, no delay.",
    icon: MessageCircle,
  },
  {
    title: "Voice Messages",
    desc: "Record and send voice notes in a tap, with waveform playback.",
    icon: Mic,
  },
  {
    title: "HD Video Calls",
    desc: "1:1 and group calls with adaptive quality, even on weak connections.",
    icon: Video,
  },
  {
    title: "Image Sharing",
    desc: "Drag, drop, or paste images directly into any conversation.",
    icon: ImageIcon,
  },
  {
    title: "File & PDF Upload",
    desc: "Share documents up to 25MB with inline previews, no downloads needed.",
    icon: FileText,
  },
  {
    title: "End-to-End Encryption",
    desc: "Every message and call is encrypted by default. We can't read them either.",
    icon: ShieldCheck,
  },
];

export default function Home() {
  const { user, loading } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Dynamic Water Droplets Layer */}
      <div className="absolute inset-0 pointer-events-none opacity-80 z-0">
        {/* Drop 1 - Top Left Large */}
        <div className="absolute top-[8%] left-[10%] w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-[2px] border border-white/30 shadow-[inset_2px_4px_8px_rgba(255,255,255,0.4),inset_-2px_-4px_8px_rgba(0,0,0,0.5),0_8px_16px_rgba(0,0,0,0.4)]" />

        {/* Drop 2 - Top Right Caustic */}
        <div className="absolute top-[18%] right-[12%] w-14 h-[4.5rem] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-white/5 backdrop-blur-[1px] border border-white/30 shadow-[inset_1px_2px_4px_rgba(255,255,255,0.6),0_6px_12px_rgba(0,0,0,0.3)]">
          <div className="absolute top-1.5 left-2 w-3 h-2 bg-white/80 rounded-full blur-[0.5px]" />
        </div>

        {/* Drop 3 - Hero Section Cluster */}
        <div className="absolute top-[38%] left-[5%] w-8 h-8 rounded-full bg-white/10 backdrop-blur-[1px] border border-white/30 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.6),0_4px_8px_rgba(0,0,0,0.3)]" />
        <div className="absolute top-[42%] left-[7%] w-5 h-5 rounded-full bg-white/10 backdrop-blur-[1px] border border-white/30 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.6)]" />

        {/* Drop 4 - Center Right Teardrop */}
        <div className="absolute top-[52%] right-[8%] w-[2.5rem] h-14 rounded-[50%_50%_40%_60%/60%_40%_60%_40%] bg-gradient-to-tr from-transparent via-white/10 to-white/20 border border-white/25 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.4),0_6px_10px_rgba(0,0,0,0.3)]" />

        {/* Drop 5 - Feature Section Left */}
        <div className="absolute top-[72%] left-[12%] w-12 h-12 rounded-full bg-gradient-to-br from-white/20 to-transparent backdrop-blur-[2px] border border-white/30 shadow-[inset_2px_3px_6px_rgba(255,255,255,0.5),0_6px_12px_rgba(0,0,0,0.3)]">
          <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/90 rounded-full blur-[0.5px]" />
        </div>

        {/* Drop 6 - Footer Cluster Right */}
        <div className="absolute bottom-[8%] right-[15%] w-16 h-16 rounded-[45%_55%_60%_40%/50%_60%_40%_50%] bg-white/5 backdrop-blur-[2px] border border-white/30 shadow-[inset_2px_3px_6px_rgba(255,255,255,0.5),0_8px_16px_rgba(0,0,0,0.4)]" />
        <div className="absolute bottom-[6%] right-[13%] w-7 h-7 rounded-full bg-white/10 border border-white/30 shadow-[inset_1px_1px_3px_rgba(255,255,255,0.6)]" />
      </div>

      {/* Ambient Lighting Glows */}
      <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-emerald-500/15 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="absolute top-1/2 -right-24 w-[30rem] h-[30rem] bg-blue-500/15 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 relative z-10 border-b border-white/10 backdrop-blur-md bg-slate-950/40">
        <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-emerald-400">
          <MessageCircle className="text-emerald-400" size={20} />
          <span>V-EGAL</span>
        </h1>

        {loading ? (
          <div className="w-9 h-9 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
        ) : user ? (
          <Link href="/profile">
            <Image
              src={user.avatar || "https://i.pravatar.cc/150"}
              alt="Profile"
              width={36}
              height={36}
              className="rounded-full bg-zinc-700 cursor-pointer border border-white/10 hover:border-emerald-400/50 transition"
            />
          </Link>
        ) : (
          <div className="flex gap-2 items-center">
            <Link href="/login">
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-sm font-medium px-4 py-2 rounded-lg transition">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-medium px-4 py-2 rounded-lg transition">
                Sign In
              </button>
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center mt-20 px-4 relative z-10 max-w-3xl mx-auto p-8 rounded-3xl bg-white/5 backdrop-blur-md shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs text-emerald-700 font-semibold    rounded-full px-3.5 py-1.5 mb-6">
          Now supporting group calls up to 5 people
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight">
          Your chat,
          <span className="block text-zinc-400">without the clutter.</span>
          
        </h1>

        <div className="mt-2 w-full max-w-lg mx-auto">
          <svg viewBox="3 60 480 80" className="w-full h-auto overflow-visible">
            <path
              id="projectile-path"
              d="M 30,100 Q 300,50 480,120"
              fill="none"
              stroke="transparent"
            />
            <text className="fill-zinc-300 text-sm font-medium tracking-wide">
              <textPath href="#projectile-path" startOffset="48.5%" textAnchor="middle">
                 messaging, voice, video, & file sharing in one fast workspace.
              </textPath>
            </text>
          </svg>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-1">
          <Link href="/login">
            <button className="flex items-center justify-center gap-2 bg-emerald-500 text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-emerald-400 transition">
              Start Chatting <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-white/5 border border-white/20 px-6 py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition">
              Sign In
            </button>
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-8 text-xs text-zinc-400">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                src={`https://i.pravatar.cc/64?img=${i + 10}`}
                alt=""
                width={24}
                height={24}
                className="rounded-full border-2 border-slate-900"
              />
            ))}
          </div>
          Trusted by 12,000+ teams worldwide
        </div>
      </div>

      {/* Dashboard Preview */}
      <div className="max-w-4xl mx-auto mt-20 p-6 relative z-10">
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Workspace activity</h2>
            <span className="text-xs text-emerald-400 flex items-center font-semibold gap-1">
              <CheckCircle2 size={14} /> All systems normal
            </span>
          </div>

          <div className="mt-5 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-emerald-500 rounded-full" />
          </div>
          <p className="text-xs font-semibold text-zinc-400 mt-2">68% of daily message volume vs. yesterday</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
            <div className="bg-black/30  px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">1,284</div>
              <div className="text-xs text-zinc-400 mt-0.5">Messages today</div>
            </div>
            <div className="bg-black/30  px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">38</div>
              <div className="text-xs text-zinc-400 mt-0.5">Active chats</div>
            </div>
            <div className="bg-black/30  px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">3</div>
              <div className="text-xs text-zinc-400 mt-0.5">Pending invites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="max-w-6xl mx-auto mt-28 px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">Features</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-3">
            Everything your team needs to talk
          </h2>
          <p className="text-zinc-400 mt-3 max-w-md mx-auto text-sm">
            No bloat, no clutter — just the tools people actually use every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-white/5 backdrop-blur-md  border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-white  flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
                  <Icon size={18} className="text-green-800" />
                </div>
                <h3 className="text-base font-medium mb-1.5">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto mt-28 mb-20 px-6 text-center relative z-10">
        <Users className="mx-auto text-zinc-500 mb-4" size={28} />
        <h2 className="text-2xl md:text-3xl font-semibold">Ready to bring your team together?</h2>
        <p className="text-zinc-400 mt-3 text-sm">Free for teams up to 5 people. No credit card required.</p>
        <Link href="/login">
          <button className="mt-7 bg-white text-black font-semibold px-6 py-3 rounded-xl text-sm hover:bg-zinc-200 transition">
            Create your workspace
          </button>
        </Link>
      </div>
    </div>
  );
}