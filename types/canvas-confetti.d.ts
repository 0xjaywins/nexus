declare module "canvas-confetti" {
  interface ConfettiOptions {
    particleCount?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    disableForReducedMotion?: boolean;
    [key: string]: any;
  }

  function confetti(options?: ConfettiOptions): void;

  export default confetti;
}
