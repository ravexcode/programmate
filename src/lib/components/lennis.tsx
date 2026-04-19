//React imports
import { useEffect } from "react";
//Lenis library for smooth scrolling
import Lenis from "lenis";

export default function SmoothProvider() {
  //Initialize Lenis on component mount
  useEffect(() => {
    const lenis = new Lenis({
      //Lenis configuration options
      //Duration of the scroll animation in milliseconds
      duration: 1.6,
      //Easing function for the scroll animation
      smoothWheel: true,
      //Multiplier for the scroll wheel (default is 1)
      wheelMultiplier: 0.75,
      //Multiplier for touch scrolling (default is 2)
      touchMultiplier: 1,
      //Multiplier for smooth scrolling when using the keyboard (default is 1)
      lerp: 0.08
    });

    //Function to be called on each animation frame
    function raf(time: number) {
      //Update Lenis with the current time
      lenis.raf(time);
      //Request the next animation frame
      requestAnimationFrame(raf);
    }

    //Start the animation loop
    requestAnimationFrame(raf);

    //Cleanup function to destroy Lenis on component unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}