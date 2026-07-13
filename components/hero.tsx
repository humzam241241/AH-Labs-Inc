"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Cpu, Map, Plane } from "lucide-react"
import { DisplayCards } from "./ui/display-cards"

const heroCards = [
  {
    id: 1,
    title: "Autonomous Systems",
    description: "Integrated robotic platforms combining mechanical design, embedded electronics, sensing, and onboard compute.",
    icon: Plane,
    gradient: "from-blue-600/80 to-cyan-600/80",
  },
  {
    id: 2,
    title: "Spatial Intelligence",
    description: "LiDAR-based sensing and mapping systems developed for indoor environments, worksites, and future field applications.",
    icon: Map,
    gradient: "from-purple-600/80 to-pink-600/80",
  },
  {
    id: 3,
    title: "Engineering Prototypes",
    description: "Mechanical systems, custom electronics, ROS 2, NVIDIA Jetson compute, and rapid prototyping brought together in working builds.",
    icon: Cpu,
    gradient: "from-orange-600/80 to-red-600/80",
  },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-center lg:text-left">
            <div className="inline-block mb-4 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <span className="text-blue-400 text-sm font-semibold">Engineering Studio</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Building intelligent systems from{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">concept to prototype</span>
            </h1>

            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              AH Labs Inc is an engineering studio developing robotics, autonomous systems, embedded electronics, and AI-enabled products. Our flagship venture is a LiDAR mapping drone platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/projects/drone" className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all flex items-center justify-center space-x-2">
                <span>Explore the Flagship Venture</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all flex items-center justify-center">
                Contact AH Labs
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="w-full lg:w-auto">
            <DisplayCards cards={heroCards} autoSlide slideInterval={4500} />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
