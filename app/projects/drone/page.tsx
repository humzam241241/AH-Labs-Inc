"use client"

import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Plane, Camera, Cpu, Radio, Gauge, MapPin, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Camera,
    title: "Computer Vision",
    description: "Advanced object detection and tracking using YOLOv8 and custom-trained models for real-time analysis.",
  },
  {
    icon: Cpu,
    title: "Edge Computing",
    description: "NVIDIA Jetson Nano/Xavier for on-board AI processing, enabling autonomous decision-making.",
  },
  {
    icon: Radio,
    title: "Sensor Fusion",
    description: "IMU, GPS, LiDAR, and ultrasonic sensors integrated with Kalman filtering for precise navigation.",
  },
  {
    icon: Gauge,
    title: "Flight Controller",
    description: "Custom PX4 autopilot integration with MAVLink protocol for stable and responsive flight control.",
  },
  {
    icon: MapPin,
    title: "Autonomous Navigation",
    description: "Path planning algorithms with obstacle avoidance and real-time route optimization.",
  },
  {
    icon: Shield,
    title: "Fail-Safe Systems",
    description: "Redundant sensors and automatic return-to-home capabilities for maximum safety.",
  },
]

const hardware = [
  { component: "Flight Controller", spec: "Pixhawk 4 / Cube Orange" },
  { component: "Compute Module", spec: "NVIDIA Jetson Xavier NX" },
  { component: "Camera", spec: "Intel RealSense D455" },
  { component: "GPS", spec: "u-blox NEO-M9N" },
  { component: "LiDAR", spec: "Lightware SF45/B" },
  { component: "IMU", spec: "BMI088 (6-axis)" },
  { component: "Battery", spec: "6S LiPo 10000mAh" },
  { component: "Motors", spec: "Brushless 2216 920KV" },
]

const roadmap = [
  {
    phase: "Phase 1 - Foundation",
    items: [
      "Basic autonomous flight with GPS waypoints",
      "Computer vision integration",
      "Manual override systems",
    ],
  },
  {
    phase: "Phase 2 - Intelligence",
    items: [
      "Object detection and tracking",
      "Dynamic obstacle avoidance",
      "Swarm communication protocols",
    ],
  },
  {
    phase: "Phase 3 - Advanced",
    items: [
      "Multi-drone coordination",
      "Advanced path planning with SLAM",
      "Long-range autonomous delivery",
    ],
  },
]

export default function DronePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
              <Plane className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Autonomous Drone Systems
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Advanced aerial robotics combining computer vision, sensor fusion, and intelligent navigation for real-world applications
            </p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden mb-8">
              <Image
                src="https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200&q=80"
                alt="Autonomous Drone"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              System Overview
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <p className="text-white/70 text-lg leading-relaxed mb-4">
                  Our autonomous drone system represents the convergence of advanced robotics, artificial intelligence, and aerospace engineering. Built on a robust hardware platform with NVIDIA Jetson compute modules and PX4 flight controllers, the system achieves real-time autonomous navigation in complex environments.
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  Utilizing computer vision for object detection, LiDAR for precise distance measurement, and sophisticated sensor fusion algorithms, our drones can navigate, track objects, avoid obstacles, and complete missions with minimal human intervention.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Core Capabilities
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/60">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Hardware Architecture
            </h2>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="grid md:grid-cols-2 gap-4">
                {hardware.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5"
                  >
                    <span className="text-white/70 font-medium">
                      {item.component}
                    </span>
                    <span className="text-purple-400 font-semibold">
                      {item.spec}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Technology Stack
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <Zap className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  Software
                </h3>
                <ul className="space-y-2 text-white/60">
                  <li>• ROS 2 (Robot Operating System)</li>
                  <li>• Python/C++ for algorithms</li>
                  <li>• TensorFlow/PyTorch for AI</li>
                  <li>• OpenCV for vision processing</li>
                  <li>• MAVLink communication protocol</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <Cpu className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  Compute
                </h3>
                <ul className="space-y-2 text-white/60">
                  <li>• NVIDIA Jetson Xavier NX</li>
                  <li>• 384-core GPU for AI inference</li>
                  <li>• 8GB RAM, 128GB storage</li>
                  <li>• 21 TOPS performance</li>
                  <li>• Low power consumption (10-15W)</li>
                </ul>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <Camera className="w-10 h-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-4">
                  Sensors
                </h3>
                <ul className="space-y-2 text-white/60">
                  <li>• Intel RealSense depth camera</li>
                  <li>• Lightware LiDAR (50m range)</li>
                  <li>• BMI088 6-axis IMU</li>
                  <li>• u-blox GPS (RTK capable)</li>
                  <li>• Ultrasonic distance sensors</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              Development Roadmap
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {roadmap.map((phase, index) => (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 text-white font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {phase.phase}
                  </h3>
                  <ul className="space-y-2">
                    {phase.items.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-purple-400 mt-1">•</span>
                        <span className="text-white/60">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
