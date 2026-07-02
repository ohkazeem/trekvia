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
				hostname: "s3.amazonaws.com",
				port: "",
				pathname: "/my-bucket/**",
				search: "",
			},
		],
	},
};

export default nextConfig;
