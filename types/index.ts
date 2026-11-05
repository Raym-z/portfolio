export type Project = {
  id: string;
  slug: string;
  title: string;
  descriptionId: string;
  descriptionEn: string;
  thumbnailUrl: string | null;
  techStack: string[];
  features: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type Certificate = {
  id: string;
  title: string;
  issuer: string | null;
  imageUrl: string;
  url: string | null;
  displayOrder: number;
  createdAt: string;
};

export type Comment = {
  id: string;
  userName: string;
  content: string;
  profileImageUrl: string | null;
  isPinned: boolean;
  createdAt: string;
};

export type Profile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: "admin" | "user";
  createdAt: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  createdAt: string;
};

export type ProjectInput = {
  title: string;
  descriptionId: string;
  descriptionEn: string;
  thumbnailUrl?: string | null;
  techStack: string[];
  features: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  published: boolean;
  displayOrder: number;
};

export type ActionResult<T = undefined> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export type AdminStats = {
  totalProjects: number;
  publishedProjects: number;
  totalCertificates: number;
  totalComments: number;
  pinnedComments: number;
  unreadMessages: number;
};
