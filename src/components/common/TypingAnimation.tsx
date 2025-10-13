
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export function TypingAnimation({ 
  phrases, 
  typingSpeed = 80, 
  deletingSpeed = 50, 
  pauseDuration = 2000 
}: TypingAnimationProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
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
          // Finished deleting, switch to next phrase
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
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
  }, [typedText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration]);

  const textToShow = typedText || ' '; // Use non-breaking space to maintain height

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={phraseIndex}
        initial="enter"
        animate="center"
        exit="exit"
        variants={variants}
        transition={{ y: { type: 'spring', stiffness: 300, damping: 30 }, opacity: { duration: 0.5 } }}
        className="inline-block"
      >
        {textToShow}
        <motion.span
          className="inline-block w-0.5 h-[1em] bg-primary ml-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          aria-hidden="true"
        />
      </motion.span>
    </AnimatePresence>
  );
}

    