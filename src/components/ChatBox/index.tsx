"use client";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

export default function ChatBox({ onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className="fixed bottom-0 right-0 w-full max-w-md h-[80vh] z-10"
    >
      <div className="relative h-full bg-slate-800/80 backdrop-blur-xl rounded-t-xl shadow-2xl border border-slate-700/50">
        <div className="p-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-white font-semibold">AI Assessment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="h-[calc(100%-80px)] p-4 overflow-y-auto">
          {/* Chat messages will go here */}
        </div>
      </div>
    </motion.div>
  );
}
