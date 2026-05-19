import { colors, typography, spacing, borderRadius } from '../src/theme';

describe('Theme tokens', () => {
  describe('colors', () => {
    it('should have primary color matching DESIGN.md', () => {
      expect(colors.primary).toBe('#00396b');
    });

    it('should have surface color', () => {
      expect(colors.surface).toBe('#f8f9ff');
    });

    it('should have on-primary as white', () => {
      expect(colors.onPrimary).toBe('#ffffff');
    });

    it('should have error color', () => {
      expect(colors.error).toBe('#ba1a1a');
    });

    it('should have secondary color', () => {
      expect(colors.secondary).toBe('#48626e');
    });
  });

  describe('typography', () => {
    it('should have headline-md with correct font size', () => {
      expect(typography['headline-md'].fontSize).toBe(20);
    });

    it('should have headline-sm with correct font size', () => {
      expect(typography['headline-sm'].fontSize).toBe(16);
    });

    it('should have body-md with correct font size', () => {
      expect(typography['body-md'].fontSize).toBe(14);
    });

    it('should have body-lg with correct font size', () => {
      expect(typography['body-lg'].fontSize).toBe(16);
    });

    it('should have label-md with correct font size', () => {
      expect(typography['label-md'].fontSize).toBe(12);
    });

    it('should have display-lg with correct font size', () => {
      expect(typography['display-lg'].fontSize).toBe(32);
    });

    it('should use Inter font family for all variants', () => {
      Object.values(typography).forEach((variant) => {
        expect(variant.fontFamily).toBe('Inter');
      });
    });
  });

  describe('spacing', () => {
    it('should have base spacing of 8', () => {
      expect(spacing.base).toBe(8);
    });

    it('should have container-padding of 16', () => {
      expect(spacing.containerPadding).toBe(16);
    });

    it('should have stack-gap of 12', () => {
      expect(spacing.stackGap).toBe(12);
    });

    it('should have inline-gap of 8', () => {
      expect(spacing.inlineGap).toBe(8);
    });

    it('should have section-margin of 24', () => {
      expect(spacing.sectionMargin).toBe(24);
    });
  });

  describe('borderRadius', () => {
    it('should have sm radius', () => {
      expect(borderRadius.sm).toBe(2);
    });

    it('should have default radius', () => {
      expect(borderRadius.default).toBe(4);
    });

    it('should have md radius', () => {
      expect(borderRadius.md).toBe(6);
    });

    it('should have lg radius', () => {
      expect(borderRadius.lg).toBe(8);
    });

    it('should have xl radius', () => {
      expect(borderRadius.xl).toBe(12);
    });

    it('should have full radius', () => {
      expect(borderRadius.full).toBe(9999);
    });
  });
});
