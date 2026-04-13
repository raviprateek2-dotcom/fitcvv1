
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const variants = {
  enter: {
    y: 10,
    opacity: 0,
  },
  center: {
    zIndex: 1,
    y: 0,
    opacity: 1,
  },
  exit: {
    zIndex: 0,
    y: -10,
    opacity: 0,
  },
};

interface TypingAnimationProps {
  phrases: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  colors?: string[];
}

export function TypingAnimation({ 
  phrases,
  typingSpeed = 80, 
  deletingSpeed = 50, 
  pauseDuration = 2000,
  colors = ['text-primary']
}: TypingAnimationProps) {
  const reduceMotion = useReducedMotion();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);

  const first = phrases[0] ?? '';
  const staticClass = colors[0] ?? 'text-primary';
  const prefersReduced = reduceMotion === true;

  useEffect(() => {
    if (prefersReduced) return;

    let timeoutId: NodeJS.Timeout;

    const handleTyping = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        if (typedText.length > 0) {
          // Deleting characters
          timeoutId = setTimeout(() => {
            setTypedText(currentPhrase.substring(0, typedText.length - 1));
          }, deletingSpeed);
        } else {
          // Finished deleting, switch to next phrase and color
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
          setColorIndex((prev) => (prev + 1) % colors.length);
        }
      } else {
        if (typedText.length < currentPhrase.length) {
          // Typing characters
          timeoutId = setTimeout(() => {
            setTypedText(currentPhrase.substring(0, typedText.length + 1));
          }, typingSpeed);
        } else {
          // Finished typing, pause and then start deleting
          timeoutId = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
        }
      }
    };

    handleTyping();

    return () => clearTimeout(timeoutId);
  }, [
    prefersReduced,
    typedText,
    isDeleting,
    phraseIndex,
    phrases,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    colors.length,
  ]);

  if (prefersReduced && first) {
    return <span className={cn('inline-block', staticClass)}>{first}</span>;
  }

  const textToShow = typedText || ' '; // Use non-breaking space to maintain height
  const currentColorClass = colors[colorIndex];

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phraseIndex}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        transition={{ y: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
        className={cn("inline-block", currentColorClass, 'transition-colors duration-500 ease-in-out')}
      >
        {textToShow}
        <motion.span
          className={cn("inline-block w-0.5 h-[1em] ml-1", currentColorClass)}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      </motion.span>
    </AnimatePresence>
  );
}
