"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";

export default function Home() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial loading animation
    const loadingTimeline = gsap.timeline();
    
    // Initial state
    gsap.set(".hero-image", { scale: 0, opacity: 0 });
    gsap.set(".logo h1", { opacity: 0 });
    gsap.set(".logo p", { opacity: 0 });
    
    // Animation sequence
    loadingTimeline
      .to(".logo h1", {
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      })
      .to(".hero-image", {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      })
      .to(".logo p", {
        opacity: 0.6,
        duration: 1,
        ease: "power2.out"
      });

    // Floating text animations
    const floatingTexts = gsap.utils.toArray<HTMLElement>('.floating-text');
    floatingTexts.forEach((text) => {
      gsap.fromTo(text,
        { 
          y: 100, 
          opacity: 0,
          rotateX: 45
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 2,
          scrollTrigger: {
            trigger: text,
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        }
      );
    });

    // Main text fade animations
    const lines = gsap.utils.toArray<HTMLElement>('.line');
    
    // Timeline for sequential text animations
    const textTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-content",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        pin: true,
      }
    });

    // Set initial state - hide all texts
    gsap.set(lines, { opacity: 0 });

    // Add animations for each line with clear separation
    lines.forEach((line, index) => {
      // Position in timeline where this text animation starts (0 to 1)
      const startPosition = index / lines.length;
      // Duration for each phase (appear, show, disappear)
      const phaseDuration = 1 / (lines.length * 3); // Divide each text's time into 3 phases

      textTimeline
        // Fade in
        .to(line, { 
          opacity: 1,
          duration: phaseDuration,
          ease: "none"
        }, startPosition)
        // Hold
        .to(line, {
          opacity: 1,
          duration: phaseDuration,
          ease: "none"
        })
        // Fade out completely
        .to(line, {
          opacity: 0,
          duration: phaseDuration,
          ease: "none"
        });
    });

    // Horizontal scroll
    if (galleryRef.current && containerRef.current) {
      const sections = gsap.utils.toArray<HTMLElement>('.gallery-item');
      
      const scrollTween = gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: galleryRef.current,
          pin: true,
          scrub: 2,
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: 0.5,
            delay: 0
          },
          end: () => "+=" + (galleryRef.current!.offsetWidth * 2.5),
          id: "galleryScroll"
        }
      });

      // Image scale animations
      sections.forEach((section) => {
        const img = section.querySelector('img');
        if (img) {
          gsap.fromTo(img, 
            { scale: 1.1 },
            {
              scale: 1,
              scrollTrigger: {
                trigger: section,
                start: "left center",
                end: "right center",
                scrub: 1.5,
                containerAnimation: scrollTween
              }
            }
          );
        }
      });
    }

    // Connect section animations
    gsap.fromTo(".connect-left",
      { x: "-100%", opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: ".connect-section",
          start: "top center",
          end: "bottom center",
          scrub: 1
        }
      }
    );

    gsap.fromTo(".connect-right",
      { x: "100%", opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.5,
        scrollTrigger: {
          trigger: ".connect-section",
          start: "top center",
          end: "bottom center", 
          scrub: 1
        }
      }
    );
  }, []);

  return (
    <ReactLenis root>
      <div ref={containerRef} className="bg-black">
        <section className="hero relative overflow-hidden">
          <div className="hero-image absolute inset-0">
            <Image 
              src="/img-2.jpg" 
              alt="Abstract blue light" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="logo absolute z-10 inset-0 flex flex-col items-center justify-center">
            <h1 className="text-8xl font-light tracking-widest mb-4 text-white">VISION</h1>
            <p className="text-sm tracking-[0.3em] opacity-60 uppercase text-white">Studio</p>
          </div>
        </section>

        <section className="main min-h-screen bg-black">
          <div className="main-content h-[300vh]">
            <div className="copy fixed top-0 left-0 w-screen h-screen flex items-center justify-center">
              <div className="line absolute w-full text-center">
                <p className="text-8xl font-light text-white">We are</p>
              </div>
              <div className="line absolute w-full text-center">
                <p className="text-8xl font-light text-white">Creating</p>
              </div>
              <div className="line absolute w-full text-center">
                <p className="text-8xl font-light text-white">Design</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={galleryRef} className="gallery overflow-hidden my-40">
          <span className="floating-text blend-difference top-[20%] left-[15%]">Create</span>
          <span className="floating-text blend-overlay top-[60%] right-[10%]">Design</span>
          <span className="floating-text blend-difference bottom-[10%] left-[40%]">Vision</span>
          
          <div className="gallery-container flex items-center">
            <div className="gallery-row flex-shrink-0 flex items-center gap-[10vw] px-[5vw]">
              <div className="gallery-item h-[80vh] w-[40vw]">
                <Image src="/img-1.jpg" alt="Gallery 1" fill className="object-cover" />
              </div>
              <div className="gallery-item h-[60vh] w-[30vw] mt-[20vh]">
                <Image src="/img-3.jpg" alt="Gallery 3" fill className="object-cover" />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[10vw] px-[5vw]">
              <div className="gallery-item h-[90vh] w-[50vw]">
                <Image src="/img-4.jpg" alt="Gallery 4" fill className="object-cover" />
              </div>
              <div className="gallery-item h-[70vh] w-[35vw] mb-[15vh]">
                <Image src="/img-5.jpg" alt="Gallery 5" fill className="object-cover" />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[10vw] px-[5vw]">
              <div className="gallery-item h-[70vh] w-[35vw] mt-[10vh]">
                <Image src="/img-6.jpg" alt="Gallery 6" fill className="object-cover" />
              </div>
              <div className="gallery-item h-[85vh] w-[45vw]">
                <Image src="/img-7.jpg" alt="Gallery 7" fill className="object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="connect-section min-h-screen bg-black relative my-40">
          <div className="absolute inset-0 flex flex-col justify-center px-20">
            <h2 className="connect-left text-8xl font-bold max-w-[80%]">
              WANNA WORK TOGETHER? ON YOUR NEXT PROJECT
            </h2>
            
            <div className="connect-right mt-32 flex items-center gap-20">
              <h3 className="text-6xl font-light">VISION</h3>
              <button className="border border-white px-8 py-4 text-lg hover:bg-white hover:text-black transition-colors">
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </div>
    </ReactLenis>
  );
}
