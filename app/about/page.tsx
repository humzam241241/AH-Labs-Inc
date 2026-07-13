"use client"

import React from "react"
import { motion } from "framer-motion"
import { Cpu, Map, Plane, Radar, Shield, Target } from "lucide-react"

const values = [
  {
    icon: Target,
    title: "Mission-Driven Engineering",
    description: "Every design decision supports a clear objective: reliable aerial mapping and inspection in real environments.",
  },
  {
    icon: Shield,
    title: "Safety by Design",
    description: "Flight stability, structural integrity, power distribution, and fail-safe behaviour are treated as core system requirements.",
  },
  {
    icon: Radar,
    title: "Measured Progress",
    description: "We validate the aircraft through CAD, simulation, bench testing, sensor data, and controlled flight trials.",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">About AH Labs</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Developing an autonomous LiDAR mapping drone from airframe to onboard computing.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="max-w-4xl mx-auto mb-20">
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                AH Labs Inc is focused exclusively on autonomous drone development. The current program is a custom quadcopter designed to collect LiDAR and motion data for three-dimensional mapping and inspection.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                The platform combines mechanical design, custom electronics, embedded flight control, ROS 2, NVIDIA Jetson edge computing, and a tilting 2D LiDAR system. The immediate objective is a controlled indoor proof of concept that can produce usable spatial data.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">What We Build</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: Plane, title: "Custom Airframe", text: "A mass-optimized quadcopter structure with an integrated electronics tray, low centre of mass, and serviceable modular layout." },
                { icon: Cpu, title: "Integrated Flight System", text: "A custom ESP32 flight-control PCB connected to IMU, barometer, radio receiver, ESCs, power regulation, and Jetson compute." },
                { icon: Map, title: "LiDAR Mapping", text: "A ROS 2 sensor pipeline using a SLAMTEC RPLIDAR C1 and a motorized tilt mechanism to expand 2D scans into 3D spatial data." },
              ].map((item) => (
                <div key={item.title} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <item.icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Engineering Principles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                  <p className="text-white/60">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
