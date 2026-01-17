export const glassPhysics = {
  idle: {
    backdropFilter: "blur(3rem)",
    background: "hsl(0 0% 100% / 0.05)",
    border: "1px solid hsl(0 0% 100% / 0.2)",
    boxShadow: "0 25px 45px -10px rgb(0 0% 0% / 0.4)",
  },
  hover: {
    transform: "scale(1.05)",
    boxShadow:
      "0 35px 55px -10px rgb(0 0% 0% / 0.6), 0 0 40px hsl(188 100% 50% / 0.3)",
    borderColor: "hsl(0 0% 100% / 0.4)",
  },
  active: {
    transform: "scale(1.1)",
    boxShadow:
      "0 45px 65px -10px rgb(0 0% 0% / 0.8), 0 0 60px hsl(188 100% 50% / 0.4)",
    borderColor: "hsl(0 0% 100% / 0.6)",
  },
  transition: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
};

export const glassOrbPhysics = {
  idle: {
    y: [0, -4, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
  hover: {
    scale: 1.01,
    filter: "brightness(1.2)",
  },
  click: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.3,
    },
  },
};
