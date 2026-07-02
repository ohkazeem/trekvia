import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	reactStrictMode: true,
	images: {
		deviceSizes: [600, 991, 1024, 1440, 2560],
		remotePatterns: [
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/**",
				search: "",
			},
			new URL("http://192.168.1.131:3000/**"),
			{
				protocol: "https",
				hostname: "portfolioapi.olapejukazeem.com",
				port: "",
				pathname: "/wp-content/uploads/**",
				search: "",
			},
		],
	},
};

export default nextConfig;
