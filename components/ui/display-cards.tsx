"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Card {
  id: number
  title: string
  description: string
  icon?: LucideIcon
  gradient?: string
}

interface DisplayCardsProps {
  cards: Card[]
  className?: string
  autoSlide?: boolean
  slideInterval?: number
}

export function DisplayCards({
  cards,
  className,
  autoSlide = true,
  slideInterval = 4000,
}: DisplayCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!autoSlide || cards.length <= 1) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length)
    }, slideInterval)
    return () => clearInterval(timer)
  }, [autoSlide, cards.length, slideInterval])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length)
  }

  if (cards.length === 0) return null

  const currentCard = cards[currentIndex]
  const Icon = currentCard.icon

  return (
    <div className={cn("relative w-full h-[400px]", className)}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={cn(
            "absolute inset-0 rounded-2xl border border-white/10 backdrop-blur-xl p-8",
            "bg-gradient-to-br shadow-2xl",
            currentCard.gradient || "from-slate-900/80 to-slate-800/80"
          )}
        >
          <div className="flex flex-col h-full justify-center">
            {Icon && (
              <Icon className="w-12 h-12 mb-4 text-white/90" />
            )}
            <h3 className="text-2xl font-bold text-white mb-3">
              {currentCard.title}
            </h3>
            <p className="text-white/70 text-lg leading-relaxed">
              {currentCard.description}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows */}
      {cards.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {cards.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-2.5 h-2.5 rounded-full transition-all",
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
