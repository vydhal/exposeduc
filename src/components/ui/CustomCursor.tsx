"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        if (!cursor) return;

        const moveCursor = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.2,
                ease: "power2.out"
            });
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest(".mosaic-item") || target.closest("button")) {
                gsap.to(cursor, { scale: 3, backgroundColor: "rgba(37, 99, 235, 0.3)", duration: 0.3 });
            }
        };

        const handleMouseLeave = () => {
            gsap.to(cursor, { scale: 1, backgroundColor: "white", duration: 0.3 });
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseenter", handleMouseEnter, true);
        document.addEventListener("mouseleave", handleMouseLeave, true);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseenter", handleMouseEnter, true);
            document.removeEventListener("mouseleave", handleMouseLeave, true);
        };
    }, []);

    return (
        <div
            ref={cursorRef}
            className="fixed top-0 left-0 w-4 h-4 bg-white rounded-full pointer-events-none z-[9999] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden md:block"
        />
    );
}
