"use client"

import React from "react"
import { motion } from "framer-motion"
import { Bot, MessageSquare, Calendar, Database, Zap, Mail, CheckCircle } from "lucide-react"

const features = [
  {
    icon: MessageSquare,
    title: "AI Customer Support",
    description: "Intelligent conversations powered by advanced NLP that understand context and provide accurate responses.",
  },
  {
    icon: Zap,
    title: "Lead Capture",
    description: "Automatically capture and qualify leads through natural conversations, integrating with your CRM.",
  },
  {
    icon: Mail,
    title: "SMS/Email Automation",
    description: "Multi-channel communication with automated follow-ups and personalized messaging.",
  },
  {
    icon: Calendar,
    title: "Calendar Booking",
    description: "Seamless appointment scheduling integrated with Google Calendar and Calendly.",
  },
  {
    icon: Database,
    title: "Knowledge Base Retrieval",
    description: "RAG-powered responses from your documentation, FAQs, and knowledge repositories.",
  },
  {
    icon: CheckCircle,
    title: "24/7 Availability",
    description: "Round-the-clock automated support that never sleeps, ensuring customer satisfaction.",
  },
]

export default function ChattyBotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6">
              <Bot className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ChattyBot
            </h1>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              AI-powered customer support and automation platform that transforms how businesses engage with customers
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
            <h2 className="text-4xl font-bold text-white mb-6 text-center">
              What is ChattyBot?
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <p className="text-white/70 text-lg leading-relaxed mb-4">
                  ChattyBot is an intelligent conversational AI platform designed to automate customer interactions, capture leads, and streamline business operations. Built with cutting-edge natural language processing and machine learning, ChattyBot understands context, learns from interactions, and provides personalized responses.
                </p>
                <p className="text-white/70 text-lg leading-relaxed">
                  Unlike traditional chatbots, ChattyBot integrates seamlessly with your existing tools, CRM systems, and communication channels, providing a unified solution for customer engagement across email, SMS, and web chat.
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
              Key Features
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/30 transition-all"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
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
              Architecture Overview
            </h2>
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Frontend Layer
                  </h3>
                  <ul className="space-y-2 text-white/60">
                    <li>• React/Next.js widget</li>
                    <li>• WebSocket connections</li>
                    <li>• Real-time messaging</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Backend Layer
                  </h3>
                  <ul className="space-y-2 text-white/60">
                    <li>• Node.js/Python API</li>
                    <li>• GPT-4 integration</li>
                    <li>• Vector database (Pinecone)</li>
                    <li>• Redis caching</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Integration Layer
                  </h3>
                  <ul className="space-y-60 text-white/60">
                    <li>• CRM APIs (Salesforce, HubSpot)</li>
                    <li>• Email/SMS providers</li>
                    <li>• Calendar APIs</li>
                    <li>• Webhook integrations</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Try ChattyBot Live
            </h2>
            <p className="text-white/60 mb-8 max-w-2xl mx-auto">
              Experience the power of ChattyBot by clicking the chat widget in the bottom right corner. Our live demo showcases real-time AI conversations and intelligent responses.
            </p>
            <div className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-full">
              <Bot className="w-5 h-5 text-blue-400" />
              <span className="text-blue-400 font-semibold">
                Click the chat icon to start
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
