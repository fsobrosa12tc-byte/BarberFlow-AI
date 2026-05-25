/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, title, description, children }) => {
  // Prevent body scroll when drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 backdrop-blur-[2px]"
          />

          {/* Drawer Panel: Slide-in details */}
          <motion.div
            initial={{ x: '100%', y: 0 }}
            animate={{ x: 0, y: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full sm:max-w-md bg-zinc-950 border-l border-zinc-900 shadow-2xl z-50 flex flex-col pt-safe"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-zinc-900 bg-zinc-950/70 sticky top-0 z-10 backdrop-blur-md">
              <div>
                <h3 className="font-sans font-bold text-lg text-zinc-50 tracking-tight">{title}</h3>
                {description && (
                  <p className="text-xs text-zinc-500 font-sans mt-0.5">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-zinc-50 transition-colors cursor-pointer"
                id="drawer-close-button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24 text-zinc-300">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
