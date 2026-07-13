"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Cpu, Gauge, Map, Plane, Radio, ScanLine } from "lucide-react"

const capabilities = [
  {
    icon: Plane,
    title: "Custom Airframe",
    description:
      "A compact capsule-and-tray mechanical architecture designed around weight, center of mass, serviceability, and indoor flight testing.",
  },
  {
    icon: Gauge,
    title: "Custom Flight Electronics",
    description:
      "An ESP32-based flight-controller PCB integrates power regulation, IMU and pressure sensing, receiver input, ESC control, and Jetson communication.",
  },
  {
    icon: Cpu,
    title: "Onboard Compute",
    description:
      "An NVIDIA Jetson Orin Nano provides the compute platform for ROS 2, LiDAR processing, mapping, and future autonomy functions.",
  },
  {
    icon: ScanLine,
    title: "LiDAR Sensing",
    description:
      "A SLAMTEC RPLIDAR C1 captures 360-degree planar range data at approximately 10 scans per second.",
  },
  {
    icon: Map,
    title: "3D Mapping Mechanism",
    description:
      "A motor-driven tilt mechanism is being developed to sweep the 2D LiDAR through multiple angles and reconstruct 3D spatial data.",
  },
  {
    icon: Radio,
    title: "Integrated Robotics Stack",
    description:
      "Mechanical design, embedded electronics, ROS 2 software, sensing, and flight control are being developed as one coordinated system.",
  },
]

const hardware = [
  { component: "Onboard computer", spec: "NVIDIA Jetson Orin Nano" },
  { component: "LiDAR", spec: "SLAMTEC RPLIDAR C1" },
  { component: "Robotics software", spec: "ROS 2 Jazzy" },
  { component: "Flight controller", spec: "Custom ESP32 PCB" },
  { component: "Flight sensors", spec: "MPU6050 + BME280" },
  { component: "Motors", spec: "4 × A2212 1000KV" },
  { component: "Propellers", spec: "10 × 4.5 inch" },
  { component: "Battery", spec: "3S 2200 mAh LiPo" },
]

const milestones = [
  {
    status: "Completed",
    items: [
      "Custom airframe and removable electronics tray",
      "Flight-controller PCB design and manufacturing checks",
      "Jetson Orin Nano running Ubuntu 24.04 and ROS 2 Jazzy",
      "RPLIDAR C1 publishing live scan data in ROS 2",
    ],
  },
  {
    status: "In Development",
    items: [
      "LiDAR tilt-gimbal and belt-drive mechanism",
      "Stable integration of the complete 1.5 kg prototype",
      "Timestamped LiDAR and tilt-angle data capture",
      "Indoor 3D mapping proof of concept",
    ],
  },
  {
    status: "Next",
    items: [
      "Flight testing with the full sensing payload",
      "Point-cloud reconstruction and mapping validation",
      "Improved localization and autonomous navigation",
      "Construction-site data collection trials",
    ],
  },
]

export default function DronePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">LiDAR Mapping Drone</h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              An active engineering prototype combining autonomous flight hardware, ROS 2, onboard Jetson compute, and mechanically scanned LiDAR for 3D mapping.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20">
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80" alt="Quadcopter drone in flight" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 text-center">Program Objective</h2>
            <div className="max-w-4xl mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                The immediate goal is an indoor proof of concept that can fly with its sensing payload and collect enough synchronized LiDAR data to reconstruct a three-dimensional map of a room or gym-sized environment.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                The longer-term direction is a construction-survey platform capable of collecting spatial data in environments where rapid deployment and aerial access are valuable.
              </p>
            </div>
          </motion.div>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Current Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((capability, index) => (
                <motion.div key={capability.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} viewport={{ once: true }} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <capability.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{capability.title}</h3>
                  <p className="text-white/60">{capability.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Current Hardware Stack</h2>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 grid md:grid-cols-2 gap-4">
              {hardware.map((item) => (
                <div key={item.component} className="flex items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-lg border border-white/5">
                  <span className="text-white/70 font-medium">{item.component}</span>
                  <span className="text-purple-400 font-semibold text-right">{item.spec}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-4xl font-bold text-white mb-12 text-center">Development Status</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {milestones.map((milestone, index) => (
                <motion.div key={milestone.status} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} viewport={{ once: true }} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">{milestone.status}</h3>
                  <ul className="space-y-3">
                    {milestone.items.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-white/60">
                        <span className="text-purple-400 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
