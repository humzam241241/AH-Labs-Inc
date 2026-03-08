"use client"

import React from "react"
import { motion } from "framer-motion"
import { Code, Cpu, Rocket, Target, Lightbulb, Users } from "lucide-react"

const values = [
  {
    icon: Lightbulb,
    title: "Innovation First",
    description: "We believe in pushing boundaries and exploring new technologies to solve real-world problems.",
  },
  {
    icon: Target,
    title: "Mission-Driven",
    description: "Every project we build has a clear purpose: to make businesses more efficient and intelligent.",
  },
  {
    icon: Users,
    title: "Customer-Centric",
    description: "We design systems that prioritize user experience and deliver measurable business value.",
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              About AH Labs
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              Engineering the intelligent systems that power the future of business
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-20"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                At AH Labs, we're building the intelligent systems that bridge the gap between software and hardware. As an engineering-driven company, we combine expertise in artificial intelligence, automation, and robotics to create solutions that transform how businesses operate.
              </p>
              <p className="text-white/70 text-lg leading-relaxed mb-4">
                Our focus is on two core areas: AI automation tools that streamline business operations and autonomous drone systems that bring intelligence to the physical world. Each project we undertake is driven by a commitment to innovation, technical excellence, and real-world impact.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                We believe the future belongs to systems that can think, learn, and act autonomously. Whether it's a chatbot that understands natural language or a drone that navigates complex environments, we're pushing the boundaries of what's possible with modern technology.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold text-white mb-12 text-center">
              What We Do
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-600/80 to-cyan-600/80 rounded-2xl p-8 border border-white/10">
                <Code className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  AI Automation Tools
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  We build intelligent software systems that automate customer support, lead capture, and business workflows. Our flagship product, ChattyBot, uses advanced NLP to provide human-like conversations that scale.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li>• Conversational AI & chatbots</li>
                  <li>• Workflow automation</li>
                  <li>• CRM integrations</li>
                  <li>• Multi-channel communication</li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-purple-600/80 to-pink-600/80 rounded-2xl p-8 border border-white/10">
                <Rocket className="w-12 h-12 text-white mb-4" />
                <h3 className="text-2xl font-bold text-white mb-4">
                  Autonomous Drone Systems
                </h3>
                <p className="text-white/90 leading-relaxed mb-4">
                  We engineer autonomous aerial robots that combine computer vision, sensor fusion, and intelligent navigation. From surveillance to delivery, our drones operate with minimal human intervention.
                </p>
                <ul className="space-y-2 text-white/80">
                  <li>• Computer vision & object detection</li>
                  <li>• Autonomous navigation</li>
                  <li>• Sensor fusion algorithms</li>
                  <li>• Real-time path planning</li>
                </ul>
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
              Our Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-white/60">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
              <Cpu className="w-16 h-16 text-purple-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">
                Engineering Excellence
              </h2>
              <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                Every line of code we write and every system we build is crafted with precision and purpose. We combine software engineering expertise with hardware innovation to create solutions that are robust, scalable, and built to last.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
