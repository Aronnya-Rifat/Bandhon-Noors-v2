export const siteConfig = {
  name: "Bandhon Noors",

  description:
    "Premium traditional clothing inspired by Bengali heritage and modern elegance.",

  logo: {
    src: "/logo.png",
    alt: "Bandhon Noors Logo",
  },

  theme: {
    primary: "#F6B6C8",
    background: "#FFFFFF",
    soft: "#FCE4EC",
    heritage: "#F3E6D8",
    accent: "#D98FA8",
    text: "#6F6F6F",
    },
  navigation: [
  {
    name: "Women",
    href: "/products?category=women",
  },

  {
    name: "Men",
    href: "/products?category=men",
  },

  {
    name: "Kids",
    href: "/products?category=baby",
  },
  {
    name: "All Products",
    href: "/products",
  },
  {
    name: "Collections",
    href: "/collections",
  },
  {
    name: "New Arrivals",
    href: "/products?sort=newest",
  },
],

  customerLinks: [
    {
      name: "My Account",
      href: "/account",
    },
    {
      name: "Orders",
      href: "/account/orders",
    },
  ],

  footerLinks: {
    company: [
      {
        name: "About Us",
        href: "/about",
      },
      {
        name: "Contact",
        href: "/contact",
      },
      {
        name: "FAQ",
        href: "/faq",
      },
    ],

    policies: [
      {
        name: "Shipping",
        href: "/shipping",
      },
      {
        name: "Returns",
        href: "/returns",
      },
      {
        name: "Privacy Policy",
        href: "/privacy",
      },
      {
        name: "Terms",
        href: "/terms",
      },
    ],
  },

  social: {
    facebook: "https://www.facebook.com/bandhon.noors",
    instagram: "https://www.instagram.com/bandhon.noors?utm_source=ig_web_button_share_sheet&stkn=ZDNlZDc0MzIxNw==",
    youtube: "",
  },

  contact: {
    email: "rumana@bandhonnoors.com",
    phone: "+880 1712205588",
  },
};
