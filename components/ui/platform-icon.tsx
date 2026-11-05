import { Globe, Mail, type LucideIcon } from "lucide-react";
import {
  DiscordIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  XIcon,
} from "@/components/ui/brand-icons";

const brandIcons: Record<
  string,
  (props: { className?: string }) => React.ReactElement
> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  instagram: InstagramIcon,
  discord: DiscordIcon,
  x: XIcon,
  twitter: XIcon,
};

const lucideIcons: Record<string, LucideIcon> = {
  mail: Mail,
  website: Globe,
  globe: Globe,
};

export function PlatformIcon({
  platform,
  className,
}: {
  platform: string;
  className?: string;
}) {
  const key = platform.toLowerCase();
  const Brand = brandIcons[key];

  if (Brand) return <Brand className={className} />;

  const Icon = lucideIcons[key] ?? Globe;
  return <Icon className={className} />;
}
