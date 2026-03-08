"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { LucideIcon, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  gradient: string
  index: number
}

export function ProjectCard({
  title,
  description,
  icon: Icon,
  href,
  gradient,
  index,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Link href={href}>
        <motion.div
          whileHover={{ y: -8, scale: 1.02 }}
          className={cn(
            "group relative overflow-hidden rounded-2xl p-8 h-full",
            "bg-gradient-to-br border border-white/10 backdrop-blur-xl",
            "hover:border-white/20 transition-all duration-300",
            "shadow-xl hover:shadow-2xl",
            gradient
          )}
        >
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Icon className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
            <p className="text-white/70 leading-relaxed mb-6">{description}</p>

            <div className="flex items-center text-white font-semibold group-hover:translate-x-2 transition-transform">
              <span>Learn more</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-white/10 transition-colors" />
        </motion.div>
      </Link>
    </motion.div>
  )
}
