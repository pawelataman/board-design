import {
  PenNib,
  Stack,
  ShareNetwork,
  Lightning,
  Image,
  DeviceMobile,
  ArrowRight,
} from "@phosphor-icons/react";

export const PenToolIcon = () => <PenNib size={28} weight="light" />;

export const LayersIcon = () => <Stack size={28} weight="light" />;

export const Share2Icon = () => <ShareNetwork size={28} weight="light" />;

export const ZapIcon = () => <Lightning size={28} weight="light" />;

export const ImageIcon = () => <Image size={28} weight="light" />;

export const SmartphoneIcon = () => <DeviceMobile size={28} weight="light" />;

export const ArrowRightIcon = ({ className = "" }: { className?: string }) => (
  <ArrowRight size={16} weight="bold" className={className} />
);
