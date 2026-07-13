"use client"

import React from "react"
import { motion } from "framer-motion"
import { Plane } from "lucide-react"
import { ProjectCard } from "./project-card"

const projects = [
  {
    title: "LiDAR Mapping Drone",
    description:
      "An active autonomous-drone prototype combining custom flight electronics, NVIDIA Jetson compute, ROS 2, and a tilt-mounted RPLIDAR for 3D spatial mapping.",
    icon: Plane,
    href: "/projects/drone",
    gradient: "from-purple-600/80 to-pink-600/80",
  },
]

export function ProjectGrid() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Current Drone Program
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            One integrated platform focused on autonomous flight, LiDAR mapping, and onboard robotics.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
