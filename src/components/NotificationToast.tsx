/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppState } from '../store/AppContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const NotificationToast: React.FC = () => {
  const { toast, dismissToast } = useAppState();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:w-96 z-50 flex items-center justify-between p-4 rounded-xl bg-zinc-900 border border-zinc-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-sans"
        >
          <div className="flex items-center space-x-3 min-w-0">
            {toast.type === 'success' && (
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-amber-500 shrink-0" />
            )}
            <p className="text-xs font-medium text-zinc-100 truncate pr-2">
              {toast.message}
            </p>
          </div>
          <button
            onClick={dismissToast}
            className="p-1 hover:bg-zinc-850 rounded-lg text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
            id="toast-close"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
