import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const ArrowLeft = () => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z" />
  </svg>
);

const ArrowRight = () => (
  <svg height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z" />
  </svg>
);

export const Scroller = ({
  children,
  height = "100%",
  width = "100%",
  withButtons,
  childrenContainerClassName,
}) => {
  const items = React.Children.toArray(children);
  const containerRef = useRef(null);
  const [showLeftOverlay, setShowLeftOverlay] = useState(false);
  const [showRightOverlay, setShowRightOverlay] = useState(false);
  const itemsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastScrollByWheel, setLastScrollByWheel] = useState(false);

  const scrollToIndex = (index) => {
    if (index >= 0 && index < items.length) {
      setCurrentIndex(index);
      itemsRef.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
  };

  const handleButtonClick = (direction) => {
    if (!lastScrollByWheel) {
      scrollToIndex(direction === "next" ? currentIndex + 1 : currentIndex - 1);
    } else {
      let nearestIndex = currentIndex;
      for (let i = 0; i < itemsRef.current.length; i++) {
        const rect = itemsRef.current[i]?.getBoundingClientRect();
        if (direction === "next") {
          if (rect && rect.left > 0) {
            nearestIndex = i < itemsRef.current.length ? i + 1 : itemsRef.current.length;
            break;
          }
        } else {
          if (rect && rect.left > 0) {
            nearestIndex = i > 0 ? i - 1 : 0;
            break;
          }
        }
      }
      setCurrentIndex(nearestIndex);
      scrollToIndex(nearestIndex);
    }
    setLastScrollByWheel(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        setShowLeftOverlay(scrollLeft > 0);
        setShowRightOverlay(scrollLeft + clientWidth < scrollWidth - 1);
      }
    };
    handleScroll();
    const element = containerRef.current;
    element?.addEventListener("scroll", handleScroll);
    return () => element?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden flex flex-col gap-3" style={{ width, height }}>
      <div
        className={clsx("flex hide-scrollbar overflow-x-auto flex-row", childrenContainerClassName)}
        ref={containerRef}
        onWheel={() => setLastScrollByWheel(true)}
      >
        {items.map((child, index) => (
          <div key={index} ref={(el) => (itemsRef.current[index] = el)}>
            {child}
          </div>
        ))}
      </div>

      {withButtons && (
        <div className="flex gap-2 justify-center z-10">
          <button
            aria-label="vorige"
            onClick={() => handleButtonClick("prev")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors text-gray-700"
          >
            <ArrowLeft />
          </button>
          <button
            aria-label="volgende"
            onClick={() => handleButtonClick("next")}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center shadow-sm transition-colors text-gray-700"
          >
            <ArrowRight />
          </button>
        </div>
      )}

      <div className={clsx(
        "absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-primary-50 to-transparent pointer-events-none transition-opacity duration-300",
        showLeftOverlay ? "opacity-100" : "opacity-0"
      )} />
      <div className={clsx(
        "absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-primary-50 to-transparent pointer-events-none transition-opacity duration-300",
        showRightOverlay ? "opacity-100" : "opacity-0"
      )} />
    </div>
  );
};
