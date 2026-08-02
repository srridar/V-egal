"use client"

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
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">

      <div className="absolute inset-0 bg-linear-to-br from-emerald-500/10 via-transparent to-blue-500/10 blur-3xl"></div>
      <div className="relative w-full h-full bg-slate-950 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)]" />
      </div>
      {/* Nav */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-5 relative z-10 border-b border-white/5">
        <h1 className="flex items-center gap-2 text-lg font-semibold tracking-tight animate-bounce">
          <MessageCircle className="text-emerald-400 " size={20} />
          <span>V-EGAL</span>
        </h1>

        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#features" className="hover:text-white transition">Features</a>
        </div>

        {loading ? (
          <div className="w-9 h-9 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin" />
        ) : user ? (
          <Link href={`/profile`}>
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
              <button className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-400 transition">
                Log In
              </button>
            </Link>
            <Link href="/register">
              <button className="bg-white text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-zinc-600 transition">
                Sign In
              </button>
            </Link>

          </div>

        )}
      </nav>

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mt-24 px-4  relative z-50 bg-emerald-900/10 p-5 w-2/3 m-auto rounded-[60%] shadow-green-900  shadow-2xl">
        <div className="inline-flex items-center gap-2 text-xs text-zinc-400 bg-white/5 border border-white/10 rounded-full px-3 py-1 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-700  animate-bounce"></span>
          Now supporting group calls up to 50 people
        </div>

        <h1 className="text-4xl md:text-6xl font-semibold leading-tight max-w-3xl">
          Your chat,
          <span className="block text-zinc-300">without the clutter.</span>
        </h1>

        <p className="mt-6 text-zinc-300 max-w-lg text-base">
          Real-time messaging, voice, video, and file sharing in one fast,
          encrypted workspace built for teams that move quick.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-9">
          <Link href="/login">
            <button className="flex items-center justify-center gap-2 bg-white text-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition">
              Start Chatting <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/login">
            <button className="bg-transparent border border-zinc-700 px-6 py-3 rounded-xl text-sm font-medium hover:border-zinc-500 transition">
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
                className="rounded-full border-2 border-[#0a0a0a]"
              />
            ))}
          </div>
          Trusted by 12,000+ teams worldwide
        </div>
      </div>

      {/* Dashboard preview */}
      <div className="max-w-4xl mx-auto mt-20 p-6 relative z-10">
        <div className="bg-zinc-950/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Workspace activity</h2>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 size={14} /> All systems normal
            </span>
          </div>

          <div className="mt-5 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-emerald-500 rounded-full"></div>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">68% of daily message volume vs. yesterday</p>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-black/40 border border-white/5 px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">1,284</div>
              <div className="text-xs text-zinc-500 mt-0.5">Messages today</div>
            </div>
            <div className="bg-black/40 border border-white/5 px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">38</div>
              <div className="text-xs text-zinc-500 mt-0.5">Active chats</div>
            </div>
            <div className="bg-black/40 border border-white/5 px-4 py-3 rounded-lg">
              <div className="text-xl font-semibold">3</div>
              <div className="text-xs text-zinc-500 mt-0.5">Pending invites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div id="features" className="max-w-6xl mx-auto mt-28 px-6 relative z-10">
        <div className="text-center mb-14">
          <span className="text-xs uppercase tracking-widest text-emerald-400/80">Features</span>
          <h2 className="text-3xl md:text-4xl font-semibold mt-3">
            Everything your team needs to talk
          </h2>
          <p className="text-zinc-500 mt-3 max-w-md mx-auto text-sm">
            No bloat, no clutter — just the tools people actually use every day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={i}
                className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5 group-hover:bg-emerald-500/20 transition">
                  <Icon size={18} className="text-emerald-400" />
                </div>
                <h3 className="text-base font-medium mb-1.5">{feature.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-3xl mx-auto mt-28 mb-20 px-6 text-center relative z-10">
        <Users className="mx-auto text-zinc-600 mb-4" size={28} />
        <h2 className="text-2xl md:text-3xl font-semibold">Ready to bring your team together?</h2>
        <p className="text-zinc-500 mt-3 text-sm">Free for teams up to 10 people. No credit card required.</p>
        <Link href="/login">
          <button className="mt-7 bg-white text-black px-6 py-3 rounded-xl text-sm font-medium hover:bg-zinc-200 transition">
            Create your workspace
          </button>
        </Link>
      </div>
    </div>
  );
}
