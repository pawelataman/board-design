import {
  PenToolIcon,
  LayersIcon,
  ImageIcon,
  Share2Icon,
  ZapIcon,
  SmartphoneIcon,
} from "./icons";
import { createElement } from "react";

export const FEATURES = [
  {
    icon: createElement(PenToolIcon),
    title: "Precision Placement",
    description:
      "Place stickers, text, and images with pixel-perfect accuracy using intuitive drag-and-rotate gizmos.",
  },
  {
    icon: createElement(LayersIcon),
    title: "Layer Management",
    description:
      "Full layer panel with reordering, visibility toggles, and lock controls. Just like Figma.",
  },
  {
    icon: createElement(ImageIcon),
    title: "Custom Graphics",
    description:
      "Upload your own images or choose from our curated library of 24+ premium sticker designs.",
  },
  {
    icon: createElement(Share2Icon),
    title: "Instant Sharing",
    description:
      "Generate a share URL with one click. Your entire design is encoded and ready to send.",
  },
  {
    icon: createElement(ZapIcon),
    title: "Real-time 3D",
    description:
      "See every change live on a physically-based 3D model with environment lighting and shadows.",
  },
  {
    icon: createElement(SmartphoneIcon),
    title: "Mobile Ready",
    description:
      "Fully responsive design with touch controls. Design on the go from any device.",
  },
];

export const STEPS = [
  {
    step: "01",
    title: "Choose Your Canvas",
    description:
      "Pick a side — front or back — and set your board color and material properties.",
  },
  {
    step: "02",
    title: "Add Your Design",
    description:
      "Drop stickers, type custom text, or upload images. Position, rotate, and scale with precision.",
  },
  {
    step: "03",
    title: "Share & Export",
    description:
      "Generate a unique URL to share your design with anyone, or save it for later.",
  },
];

export const STATS = [
  { value: 24, suffix: "+", label: "Sticker Designs" },
  { value: 100, suffix: "%", label: "Browser-based" },
  { value: 0, suffix: "", label: "Downloads Required", display: "Zero" },
  { value: 60, suffix: "fps", label: "Real-time 3D" },
];

export const TESTIMONIALS = [
  {
    quote:
      "Finally a board designer that doesn't feel like software from 2005. The 3D preview is chef's kiss.",
    name: "Alex Rivera",
    role: "Pro Snowboarder",
    avatar: "AR",
  },
  {
    quote:
      "I use this to prototype custom board graphics before sending them to print. Saves me hours.",
    name: "Sarah Chen",
    role: "Graphic Designer",
    avatar: "SC",
  },
  {
    quote:
      "The share link feature is genius. I send mockups to clients and they can see the design in 3D.",
    name: "Marcus Webb",
    role: "Board Shop Owner",
    avatar: "MW",
  },
];
