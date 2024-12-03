"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis as Lenis } from "@studio-freight/react-lenis";

export default function Home() {
  const galleryRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Initial state
    gsap.set(".hero-image", { scale: 0, opacity: 0 });
    gsap.set(".logo h1", { opacity: 0, y: 30 });
    gsap.set(".logo p", { opacity: 0, y: 20 });
    gsap.set(".line", { opacity: 0 });
    gsap.set(".floating-text", { opacity: 0 });

    // Initial load animation
    const loadingTimeline = gsap.timeline();
    loadingTimeline
      .to(".logo h1", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: "power3.out"
      })
      .to(".hero-image", {
        scale: 1,
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      }, "-=0.5")
      .to(".logo p", {
        opacity: 0.6,
        y: 0,
        duration: 1,
        ease: "power2.out"
      }, "-=1.5");

    // Combined hero timeline
    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 1
      }
    });

    // First move the image up completely
    heroTimeline
      .to(".hero-image", {
        y: "-100%",
        duration: 2
      })
      // Then fade out the logo
      .to(".logo", {
        opacity: 0,
        duration: 1
      });

    // Main text animations
    const mainTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".main-content",
        start: "top top",
        end: "+=300%",
        pin: true,
        scrub: 1
      }
    });

    // Animate each line sequentially - only opacity, no movement
    const lines = gsap.utils.toArray(".line");
    lines.forEach((line, i) => {
      mainTimeline
        .fromTo(line,
          { 
            opacity: 0
          },
          { 
            opacity: 1,
            duration: 0.5
          }
        )
        .to(line, {
          opacity: 0,
          duration: 0.5
        }, "+=1");
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
          scrub: 1,
          snap: {
            snapTo: 1 / (sections.length - 1),
            duration: 0.3,
            delay: 0
          },
          end: () => "+=" + (galleryRef.current!.offsetWidth * 4),
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
                scrub: 1,
                containerAnimation: scrollTween
              }
            }
          );
        }
      });

      // Floating text animations - only start when scrolling to gallery
      const texts = gsap.utils.toArray<HTMLElement>('.floating-text');
      texts.forEach((text, index) => {
        const direction = index % 2 === 0 ? -150 : 150;
        const startX = index % 2 === 0 ? "25vw" : "-25vw";
        
        gsap.fromTo(text,
          { 
            x: startX,
            opacity: 0,
            scale: 0.9,
            rotateY: index % 2 === 0 ? 15 : -15
          },
          {
            x: `${direction}vw`,
            opacity: 1,
            scale: 1.1,
            rotateY: index % 2 === 0 ? -15 : 15,
            scrollTrigger: {
              trigger: galleryRef.current,
              start: "top center",
              end: "bottom bottom",
              scrub: 2,
              containerAnimation: scrollTween,
              toggleActions: "play none none reverse"
            }
          }
        );
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
    <Lenis root>
      <div ref={containerRef} className="bg-black min-h-screen w-screen overflow-x-hidden">
        <section className="hero relative h-screen w-full overflow-hidden">
          <div className="hero-image absolute inset-0">
            <Image 
              src="/img-2.jpg" 
              alt="Abstract blue light" 
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="logo absolute z-10 inset-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-light tracking-[0.2em] mb-4 text-white/90">
              VISION
            </h1>
            <p className="text-xs md:text-sm tracking-[0.3em] text-white/60 uppercase">Studio</p>
          </div>
        </section>

        <section className="main min-h-screen w-full bg-black">
          <div className="main-content relative h-screen">
            <div className="copy fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center">
              <div className="line absolute w-full text-center opacity-0">
                <p className="text-4xl md:text-6xl lg:text-8xl font-light tracking-[0.2em] text-white/90">We are</p>
              </div>
              <div className="line absolute w-full text-center opacity-0">
                <p className="text-4xl md:text-6xl lg:text-8xl font-light tracking-[0.2em] text-white/90">Creating</p>
              </div>
              <div className="line absolute w-full text-center opacity-0">
                <p className="text-4xl md:text-6xl lg:text-8xl font-light tracking-[0.2em] text-white/90">Design</p>
              </div>
            </div>
          </div>
        </section>

        <section ref={galleryRef} className="gallery overflow-hidden my-20 md:my-40 w-full">
          <div className="relative w-full h-full">
            <span className="floating-text mix-blend-difference absolute top-[5%] left-[8%] text-[18vw] font-black opacity-0">
              Create
            </span>
            <span className="floating-text mix-blend-overlay absolute top-[40%] right-[12%] text-[22vw] font-black opacity-0">
              Design
            </span>
            <span className="floating-text mix-blend-exclusion absolute bottom-[8%] left-[20%] text-[25vw] font-black opacity-0">
              Vision
            </span>
          </div>

          <div className="gallery-container flex items-center">
            <div className="gallery-row flex-shrink-0 flex items-center gap-[15vw] px-[8vw]">
              <div className="gallery-item h-[85vh] w-[45vw] relative">
                <Image 
                  src="/img-13.jpg" 
                  alt="Gallery 13" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[65vh] w-[35vw] mt-[15vh] relative">
                <Image 
                  src="/img-11.jpg" 
                  alt="Gallery 11" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[18vw] px-[10vw]">
              <div className="gallery-item h-[75vh] w-[40vw] -mt-[10vh] relative">
                <Image 
                  src="/img-9.jpg" 
                  alt="Gallery 9" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[55vh] w-[30vw] mb-[20vh] relative">
                <Image 
                  src="/img-7.jpg" 
                  alt="Gallery 7" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[16vw] px-[8vw]">
              <div className="gallery-item h-[70vh] w-[38vw] mt-[5vh] relative">
                <Image 
                  src="/img-10.jpg" 
                  alt="Gallery 10" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[60vh] w-[32vw] -mb-[15vh] relative">
                <Image 
                  src="/img-6.jpg" 
                  alt="Gallery 6" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[20vw] px-[10vw]">
              <div className="gallery-item h-[80vh] w-[42vw] -mt-[8vh] relative">
                <Image 
                  src="/img-8.jpg" 
                  alt="Gallery 8" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[58vh] w-[34vw] mb-[12vh] relative">
                <Image 
                  src="/img-12.jpg" 
                  alt="Gallery 12" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[15vw] px-[8vw]">
              <div className="gallery-item h-[75vh] w-[40vw] mt-[10vh] relative">
                <Image 
                  src="/img-1.jpg" 
                  alt="Gallery 1" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[65vh] w-[35vw] -mb-[10vh] relative">
                <Image 
                  src="/img-3.jpg" 
                  alt="Gallery 3" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>

            <div className="gallery-row flex-shrink-0 flex items-center gap-[18vw] px-[10vw]">
              <div className="gallery-item h-[70vh] w-[38vw] -mt-[5vh] relative">
                <Image 
                  src="/img-4.jpg" 
                  alt="Gallery 4" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
              <div className="gallery-item h-[60vh] w-[32vw] mb-[15vh] relative">
                <Image 
                  src="/img-5.jpg" 
                  alt="Gallery 5" 
                  fill 
                  className="object-cover"
                  priority 
                />
              </div>
            </div>
          </div>
        </section>
        <section className="connect-section min-h-screen bg-black relative my-40 md:my-40">
          <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-20 translate-x-[5vw] md:translate-x-[10vw]">
            <h2 className="connect-left text-5xl md:text-6xl lg:text-7xl font-bold max-w-full md:max-w-[80%] text-white leading-tight">
              WANNA WORK TOGETHER?
              <br />
              ON YOUR NEXT PROJECT
            </h2>
            
            <div className="connect-right mt-16 md:mt-32 flex flex-col md:flex-row items-start gap-8 md:gap-20">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-white/80">VISION</h3>
              <button className="border border-white/20 hover:border-white px-8 py-4 text-lg text-white/80 hover:text-white transition-all duration-300">
                Get in Touch
              </button>
            </div>
          </div>
        </section>
      </div>
    </Lenis>
  );
}
