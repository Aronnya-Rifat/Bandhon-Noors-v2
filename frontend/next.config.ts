import type {
  NextConfig,
} from "next";


const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000",
);


const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP:
      process.env.NODE_ENV !==
      "production",

    remotePatterns: [
      {
        protocol:
          apiUrl.protocol === "https:"
            ? "https"
            : "http",

        hostname: apiUrl.hostname,

        port: apiUrl.port,

        pathname: "/uploads/**",
      },
    ],
  },
};


export default nextConfig;
