"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bot, Plane } from "lucide-react"
import { ProjectCard } from "./project-card"

const projects = [
  {
    title: "ChattyBot",
    description: "AI-powered customer support and automation platform with lead capture, SMS/email automation, and intelligent knowledge base retrieval.",
    icon: Bot,
    href: "/projects/chattybot",
    gradient: "from-blue-600/80 to-cyan-600/80",
  },
  {
    title: "Autonomous Drone Systems",
    description: "Advanced autonomous drones with computer vision, sensor fusion, and real-time navigation for surveillance and delivery applications.",
    icon: Plane,
    href: "/projects/drone",
    gradient: "from-purple-600/80 to-pink-600/80",
  },
]

export function ProjectGrid() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Cutting-edge solutions combining AI, automation, and hardware innovation
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
