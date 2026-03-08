"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const chatbotUrl = process.env.NEXT_PUBLIC_CHATBOT_URL

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[500px] bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">ChattyBot</h3>
                  <p className="text-white/80 text-xs">Online now</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="h-[calc(100%-64px)]">
              {chatbotUrl ? (
                <iframe
                  src={chatbotUrl}
                  className="w-full h-full border-0"
                  title="ChattyBot"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <MessageCircle className="w-16 h-16 text-white/30 mb-4" />
                  <h4 className="text-white text-lg font-semibold mb-2">
                    ChattyBot Demo
                  </h4>
                  <p className="text-white/60 text-sm mb-6">
                    Set NEXT_PUBLIC_CHATBOT_URL to your chat embed URL, or ensure widget.js is deployed at chattybot-tawny.vercel.app/widget.js
                  </p>
                  <div className="w-full space-y-3">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-left">
                      <p className="text-white/80 text-sm">
                        👋 Hi! How can I help you today?
                      </p>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-left">
                      <p className="text-white/80 text-sm">
                        💡 I can help with customer support, lead capture, and booking.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-purple-500/50 transition-shadow flex items-center justify-center"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </motion.button>
    </>
  )
}
