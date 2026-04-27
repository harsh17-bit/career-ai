import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "../../lib/utils";

export const Dock = ({ children, className }) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex h-16 items-end gap-2 rounded-full bg-white/50 dark:bg-black/20 p-2 backdrop-blur-2xl border border-zinc-200 dark:border-white/10 shadow-2xl overflow-visible",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { mouseX });
        }
        return child;
      })}
    </motion.div>
  );
};

export const DockSeparator = ({ mouseX, ...props }) => {
  // We ignore mouseX to prevent React DOM warnings
  return (
    <div
      className="w-[1px] h-8 bg-zinc-300 dark:bg-zinc-700/50 mx-2 self-center"
      {...props}
    />
  );
};

export const DockIcon = ({
  mouseX,
  children,
  className,
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 60, 40]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "relative flex aspect-square cursor-pointer items-center justify-center rounded-full bg-white dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors shadow-sm border border-black/5 dark:border-white/10",
        className
      )}
    >
      {children}
    </motion.div>
  );
};
