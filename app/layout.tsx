import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700", "800"],
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL(siteConfig.url),
	title: {
		default: `${siteConfig.name} — ${siteConfig.role}`,
		template: `%s — ${siteConfig.name}`,
	},
	description: siteConfig.description,
	keywords: [siteConfig.name, siteConfig.role, "portfolio", "web developer", "full-stack developer"],
	authors: [{ name: siteConfig.name }],
	creator: siteConfig.name,
	openGraph: {
		type: "website",
		url: siteConfig.url,
		title: `${siteConfig.name} — ${siteConfig.role}`,
		description: siteConfig.description,
		siteName: siteConfig.name,
	},
	twitter: {
		card: "summary_large_image",
		title: `${siteConfig.name} — ${siteConfig.role}`,
		description: siteConfig.description,
	},
	robots: {
		index: true,
		follow: true,
	},
};

export const viewport: Viewport = {
	themeColor: "#030014",
	colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en' data-scroll-behavior='smooth' className={`${poppins.variable} h-full antialiased`}>
			<body className='min-h-full bg-background text-[#e9e6f5]'>
				<Script id='scroll-restoration' strategy='beforeInteractive'>
					{`if ("scrollRestoration" in history) { history.scrollRestoration = "manual"; }`}
				</Script>
				{children}
			</body>
		</html>
	);
}
