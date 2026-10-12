"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { devicePose } from "@/lib/device-choreography";

/** A light, immediately available version of the same hardware and scroll pose. */
export default function DevicePreview({ kind, image, progress, animated }: {
  kind: "laptop" | "phone";
  image: string;
  progress: MotionValue<number>;
  animated: boolean;
}) {
  const phone = kind === "phone";
  const rotationY = useTransform(progress, value => devicePose(value, phone, animated).rotationY * 180 / Math.PI);
  const lidRotation = useTransform(progress, value => -devicePose(value, false, animated).hinge * 180 / Math.PI);
  const screenOpacity = useTransform(progress, value => devicePose(value, false, animated).hinge < 1.2 ? 1 : 0);
  return <div className={`device-preview ${phone ? "preview-phone" : "preview-laptop"}`} aria-hidden="true">
    <motion.div className="preview-hardware" style={{ rotateY: rotationY }}>
      {phone ? <>
        <div className="preview-phone-back"><span className="preview-camera-plate"><i /><i /><i /><b /></span></div>
        <div className="preview-phone-front"><div className="preview-phone-display"><Image src={image} alt="" fill sizes="(min-width: 900px) 500px, 70vw" className="object-contain" loading="eager" fetchPriority="low" unoptimized /><i className="preview-island" /><i className="preview-home" /></div></div>
        <i className="preview-phone-button" />
      </> : <>
        <motion.div className="preview-laptop-lid" style={{ rotateX: lidRotation }}>
          <motion.div className="preview-laptop-display" style={{ opacity: screenOpacity }}><Image src={image} alt="" fill sizes="(min-width: 900px) 1000px, 90vw" className="object-contain" loading="eager" fetchPriority="low" unoptimized /><i className="preview-notch" /></motion.div>
        </motion.div>
        <div className="preview-laptop-deck"><i /><b /></div>
      </>}
    </motion.div>
  </div>;
}
