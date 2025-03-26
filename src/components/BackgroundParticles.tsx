// "use client";
// import { motion } from "framer-motion";

// const BackgroundParticles = () => {
//   // Large circles configuration - positioned in all corners and center
//   const circles = [
//     // Top Left (largest)
//     {
//       id: 1,
//       size: "w-[40vw] h-[40vw]",
//       color: "rgba(99, 102, 241, 0.15)",
//       initialX: "-10%",
//       initialY: "-10%",
//       moveX: ["-10%", "5%", "-10%"],
//       moveY: ["-10%", "5%", "-10%"],
//     },
//     // Top Right
//     {
//       id: 2,
//       size: "w-[35vw] h-[35vw]",
//       color: "rgba(147, 51, 234, 0.15)",
//       initialX: "80%",
//       initialY: "-15%",
//       moveX: ["0%", "-15%", "0%"],
//       moveY: ["-15%", "5%", "-15%"],
//     },
//     // Bottom Left
//     {
//       id: 3,
//       size: "w-[30vw] h-[30vw]",
//       color: "rgba(79, 70, 229, 0.15)",
//       initialX: "-5%",
//       initialY: "70%",
//       moveX: ["-5%", "10%", "-5%"],
//       moveY: ["70%", "60%", "70%"],
//     },
//     // Bottom Right
//     {
//       id: 4,
//       size: "w-[25vw] h-[25vw]",
//       color: "rgba(129, 140, 248, 0.15)",
//       initialX: "75%",
//       initialY: "75%",
//       moveX: ["75%", "85%", "75%"],
//       moveY: ["75%", "65%", "75%"],
//     },
//     // Center
//     {
//       id: 5,
//       size: "w-[20vw] h-[20vw]",
//       color: "rgba(165, 180, 252, 0.1)",
//       initialX: "40%",
//       initialY: "40%",
//       moveX: ["40%", "45%", "40%"],
//       moveY: ["40%", "45%", "40%"],
//     },
//   ];

//   return (
//     <>
//       {/* Beautiful gradient background */}
//       <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/30" />

//       {/* Grid pattern */}
//       <motion.div
//         className="absolute inset-0 opacity-15"
//         style={{
//           backgroundImage: `
//             linear-gradient(to right, #a78bfa20 1px, transparent 1px),
//             linear-gradient(to bottom, #a78bfa20 1px, transparent 1px)
//           `,
//           backgroundSize: "50px 50px",
//         }}
//         animate={{
//           backgroundPosition: ["0 0", "-50px 50px"],
//         }}
//         transition={{
//           duration: 60,
//           repeat: Infinity,
//           ease: "linear",
//         }}
//       />

//       {/* Large animated circles */}
//       {circles.map((circle) => (
//         <motion.div
//           key={circle.id}
//           className={`absolute ${circle.size} rounded-full blur-3xl`}
//           style={{
//             backgroundColor: circle.color,
//             left: circle.initialX,
//             top: circle.initialY,
//           }}
//           animate={{
//             x: circle.moveX,
//             y: circle.moveY,
//             scale: [1, 1.05, 1],
//           }}
//           transition={{
//             duration: 25 + circle.id * 3,
//             repeat: Infinity,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//     </>
//   );
// };

// export default BackgroundParticles;
"use client";
import { motion } from "framer-motion";

const BackgroundParticles = () => {
  // Large circles configuration with softer colors and contained movement
  const circles = [
    // Top Left
    {
      id: 1,
      size: "w-[30vw] h-[30vw]",
      color: "rgba(99, 102, 241, 0.08)", // More transparent
      initialX: "10%",
      initialY: "10%",
      moveX: ["10%", "15%", "10%"], // Smaller movement range
      moveY: ["10%", "15%", "10%"],
    },
    // Top Right
    {
      id: 2,
      size: "w-[28vw] h-[28vw]",
      color: "rgba(147, 51, 234, 0.08)",
      initialX: "70%",
      initialY: "15%",
      moveX: ["70%", "65%", "70%"],
      moveY: ["15%", "20%", "15%"],
    },
    // Bottom Left
    {
      id: 3,
      size: "w-[25vw] h-[25vw]",
      color: "rgba(79, 70, 229, 0.08)",
      initialX: "15%",
      initialY: "65%",
      moveX: ["15%", "20%", "15%"],
      moveY: ["65%", "60%", "65%"],
    },
    // Bottom Right
    {
      id: 4,
      size: "w-[22vw] h-[22vw]",
      color: "rgba(129, 140, 248, 0.08)",
      initialX: "65%",
      initialY: "70%",
      moveX: ["65%", "70%", "65%"],
      moveY: ["70%", "75%", "70%"],
    },
    // Center
    {
      id: 5,
      size: "w-[18vw] h-[18vw]",
      color: "rgba(165, 180, 252, 0.06)", // Most subtle
      initialX: "45%",
      initialY: "45%",
      moveX: ["45%", "48%", "45%"], // Very subtle movement
      moveY: ["45%", "48%", "45%"],
    },
  ];

  return (
    <>
      {/* Softer gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-slate-900 to-purple-900/20" />
      Grid pattern
      <motion.div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, #a78bfa20 1px, transparent 1px),
            linear-gradient(to bottom, #a78bfa20 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
        animate={{
          backgroundPosition: ["0 0", "-50px 50px"],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      {/* Large animated circles with containment */}
      {circles.map((circle) => (
        <motion.div
          key={circle.id}
          className={`absolute ${circle.size} rounded-full blur-[100px]`} // Increased blur
          style={{
            backgroundColor: circle.color,
            left: circle.initialX,
            top: circle.initialY,
            transform: "translate(-50%, -50%)", // Better centering
          }}
          animate={{
            x: circle.moveX,
            y: circle.moveY,
            scale: [1, 1.02, 1], // More subtle scaling
          }}
          transition={{
            duration: 30 + circle.id * 5, // Slower animations
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

export default BackgroundParticles;
