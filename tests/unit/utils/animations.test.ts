import { describe, it, expect } from 'vitest';
import { pageTransition, fadeIn, staggerContainer, chatBubble } from '@/utils/animations';

describe('Animation Variants', () => {
  describe('pageTransition', () => {
    it('has initial state with opacity 0 and y offset', () => {
      expect(pageTransition.initial).toEqual({ opacity: 0, y: 10 });
    });

    it('animates to full opacity and y 0 with easeOut', () => {
      expect(pageTransition.animate).toEqual({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' },
      });
    });

    it('exits with opacity 0 and negative y offset with easeIn', () => {
      expect(pageTransition.exit).toEqual({
        opacity: 0,
        y: -10,
        transition: { duration: 0.3, ease: 'easeIn' },
      });
    });

    it('has all three variant keys', () => {
      expect(pageTransition).toHaveProperty('initial');
      expect(pageTransition).toHaveProperty('animate');
      expect(pageTransition).toHaveProperty('exit');
    });
  });

  describe('fadeIn', () => {
    it('starts invisible with y offset of 20', () => {
      expect(fadeIn.initial).toEqual({ opacity: 0, y: 20 });
    });

    it('animates to visible at y 0 with 400ms duration', () => {
      expect(fadeIn.animate).toEqual({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: 'easeOut' },
      });
    });

    it('does not define an exit variant', () => {
      expect(fadeIn.exit).toBeUndefined();
    });
  });

  describe('staggerContainer', () => {
    it('has empty initial state', () => {
      expect(staggerContainer.initial).toEqual({});
    });

    it('staggers children by 150ms', () => {
      expect(staggerContainer.animate).toEqual({
        transition: { staggerChildren: 0.15 },
      });
    });
  });

  describe('chatBubble', () => {
    it('starts invisible, offset, and slightly scaled down', () => {
      expect(chatBubble.initial).toEqual({ opacity: 0, y: 10, scale: 0.95 });
    });

    it('animates to full visibility with 300ms duration', () => {
      expect(chatBubble.animate).toEqual({
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
    });
  });
});
