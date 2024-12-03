declare module 'gsap/ScrollTrigger' {
  export const ScrollTrigger: any;
}

declare module 'gsap' {
  export interface GSAPUtils {
    toArray<T>(selector: string): T[];
  }

  export interface GSAPTimeline {
    to(target: any, vars: object, position?: number | string): GSAPTimeline;
    fromTo(target: any, fromVars: object, toVars: object, position?: number | string): GSAPTimeline;
    kill(): void;
  }

  export interface GSAP {
    timeline(vars?: object): GSAPTimeline;
    to(target: any, vars: object): GSAPTimeline;
    set(target: any, vars: object): void;
    fromTo(target: any, fromVars: object, toVars: object): GSAPTimeline;
    utils: GSAPUtils;
    registerPlugin(...plugins: any[]): void;
  }

  const gsap: GSAP;
  export default gsap;
} 