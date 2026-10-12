"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function ProductScenery({ project, name }: { project: string; name: string }) {
  const reduced = useReducedMotion();
  return <div className="product-scenery" aria-hidden="true">
    <motion.div className="product-scenery-word" key={project} initial={{ opacity: 0, y: reduced ? 0 : 25 }} animate={{ opacity: .055, y: 0 }} transition={{ duration: reduced ? 0 : .9 }}>{name}</motion.div>
    <svg viewBox="0 0 1440 850" preserveAspectRatio="xMidYMid slice">
      {project === "vocalxi" && <g strokeWidth="1">{Array.from({ length: 24 }, (_, i) => <motion.path key={i} d={`M ${70+i*7} 425 C 300 ${100+i*9}, 440 ${680-i*4}, 720 425 S 1080 ${130+i*17}, ${1370-i*7} 425`} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduced ? 0 : 1.3, delay: reduced ? 0 : i*.018 }} />)}</g>}
      {project === "quzo-ai" && <g strokeWidth="1">{Array.from({ length: 12 }, (_, i) => <rect key={i} x={215+i*23} y={110+i*13} width={1010-i*46} height={610-i*26} rx={18+i*4} transform={`rotate(${i*3} 720 425)`} />)}</g>}
      {project === "extendedforms-io" && <g strokeWidth="1">{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${130+i*175} ${180+(i%2)*60})`}><path d="M0 0h95v165H0Z M20 30h55M20 47h36M20 100l17 17 40-45" /><circle cx="47" cy="247" r="6" /><path d="M47 165v76M47 253v70" strokeDasharray="3 8" /></g>)}</g>}
      {project === "hey-buddy" && <g strokeWidth="1.2"><path d="M60 180C480-40 350 880 800 570S1140 140 1380 310" strokeDasharray="5 10" />{[[210,260],[1180,490],[950,210],[480,680]].map(([x,y],i)=><g key={i}><circle cx={x} cy={y} r="20" /><circle cx={x} cy={y} r="45" /><circle cx={x} cy={y} r="70" /><path d={`M${x-8} ${y}h16M${x} ${y-8}v16`} /></g>)}</g>}
    </svg>
    <div className="scenery-floor" />
  </div>;
}
