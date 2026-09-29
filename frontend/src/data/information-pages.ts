export interface InformationSection {
  heading: string;
  paragraphs?: string[];
  items?: string[];
}

export interface InformationPage {
  title: string;
  eyebrow: string;
  introduction: string;
  sections: InformationSection[];
}

export const informationPages: Record<
  string,
  InformationPage
> = {
  about: {
    title: "About Bandhon Noors",
    eyebrow: "Our Story",
    introduction:
      "Bandhon Noors brings Bengali heritage and modern design together through thoughtfully selected clothing, accessories, and handmade products.",
    sections: [
      {
        heading: "Our Purpose",
        paragraphs: [
          "We want traditional products to feel relevant, accessible, and easy to discover online.",
          "Our collections are chosen to celebrate craftsmanship while meeting the needs of modern customers.",
        ],
      },
      {
        heading: "What We Offer",
        items: [
          "Women’s traditional clothing",
          "Men’s traditional and casual clothing",
          "Baby and children’s products",
          "Jute products",
          "Pearl ornaments",
          "Home and miscellaneous products",
        ],
      },
      {
        heading: "Our Commitment",
        paragraphs: [
          "We aim to present every product clearly, provide dependable customer service, and improve the shopping experience as Bandhon Noors grows.",
        ],
      },
    ],
  },

  contact: {
    title: "Contact Us",
    eyebrow: "Customer Support",
    introduction:
      "Contact Bandhon Noors if you need help with a product, order, delivery, payment, or return.",
    sections: [
      {
        heading: "Before Contacting Us",
        items: [
          "Keep your order number available when asking about an order.",
          "Include the product name or product code when asking about a product.",
          "For a damaged or incorrect item, keep the product and packaging until support responds.",
        ],
      },
      {
        heading: "Contact Details",
        paragraphs: [
          "Our official email address, phone number, and social-media accounts will appear here and in the website footer after they are configured.",
        ],
      },
    ],
  },

  faq: {
    title: "Frequently Asked Questions",
    eyebrow: "Help",
    introduction:
      "Answers to common questions about ordering from Bandhon Noors.",
    sections: [
      {
        heading: "How do I place an order?",
        paragraphs: [
          "Choose a product and an available variant, add it to your cart, then complete checkout using a saved or new shipping address.",
        ],
      },
      {
        heading: "Which payment method is available?",
        paragraphs: [
          "Cash on Delivery is currently available. Additional verified payment options may be added later.",
        ],
      },
      {
        heading: "How can I check my order?",
        paragraphs: [
          "Log in and open My Account, then select My Orders to see the current order status and payment information.",
        ],
      },
      {
        heading: "Can I save products for later?",
        paragraphs: [
          "Yes. Use the heart button on a product card or product page to add it to your wishlist.",
        ],
      },
      {
        heading: "Can I change an order after placing it?",
        paragraphs: [
          "Contact customer support as soon as possible. Changes may not be possible after processing or shipping begins.",
        ],
      },
    ],
  },

  shipping: {
    title: "Shipping Information",
    eyebrow: "Delivery",
    introduction:
      "Delivery charges and timing depend on the destination and the current order volume.",
    sections: [
      {
        heading: "Delivery Charges",
        items: [
          "Inside Dhaka: ৳80",
          "Outside Dhaka: ৳150",
        ],
      },
      {
        heading: "Order Processing",
        paragraphs: [
          "Orders begin in Pending status. The status changes as the order is confirmed, processed, shipped, and delivered.",
        ],
      },
      {
        heading: "Delivery Address",
        paragraphs: [
          "Customers are responsible for providing a complete name, phone number, address, city, and any relevant postal information.",
        ],
      },
      {
        heading: "Delays",
        paragraphs: [
          "Weather, public holidays, courier availability, and remote delivery locations may affect delivery time.",
        ],
      },
    ],
  },

  returns: {
    title: "Returns and Exchanges",
    eyebrow: "Customer Care",
    introduction:
      "If an item arrives damaged, incorrect, or materially different from the confirmed order, contact Bandhon Noors promptly.",
    sections: [
      {
        heading: "Return Requirements",
        items: [
          "The item should be unused and unwashed.",
          "Original packaging, labels, and included accessories should be retained.",
          "Proof of purchase or the order number may be required.",
          "The issue should be reported before returning the item.",
        ],
      },
      {
        heading: "Items That May Not Be Returnable",
        items: [
          "Used, washed, altered, or damaged products",
          "Products missing original labels or packaging",
          "Items damaged after delivery",
          "Personalized or specially prepared products unless defective",
        ],
      },
      {
        heading: "Approval",
        paragraphs: [
          "A return or exchange should not be sent until customer support confirms the instructions and return destination.",
        ],
      },
    ],
  },

  privacy: {
    title: "Privacy Policy",
    eyebrow: "Your Information",
    introduction:
      "Bandhon Noors uses customer information to operate the store, process orders, provide support, and improve the shopping experience.",
    sections: [
      {
        heading: "Information We Use",
        items: [
          "Name, email address, and phone number",
          "Shipping addresses",
          "Order and payment-status information",
          "Cart and account activity",
          "Technical information needed to operate and secure the website",
        ],
      },
      {
        heading: "How Information Is Used",
        items: [
          "Creating and managing customer accounts",
          "Processing and delivering orders",
          "Providing customer support",
          "Preventing misuse and protecting the store",
          "Improving products and website operation",
        ],
      },
      {
        heading: "Payment Information",
        paragraphs: [
          "The website currently supports Cash on Delivery. If electronic payment providers are added, their own privacy and security terms may also apply.",
        ],
      },
      {
        heading: "Data Protection",
        paragraphs: [
          "Access to customer and administrative information is restricted according to account roles. No internet service can guarantee absolute security, but reasonable safeguards should be maintained.",
        ],
      },
    ],
  },

  terms: {
    title: "Terms and Conditions",
    eyebrow: "Store Terms",
    introduction:
      "By using the Bandhon Noors website or placing an order, you agree to these store terms.",
    sections: [
      {
        heading: "Product Information",
        paragraphs: [
          "We aim to describe products accurately. Colors and appearance may vary slightly because of lighting, photography, displays, and handmade production.",
        ],
      },
      {
        heading: "Orders",
        paragraphs: [
          "An order may be reviewed before confirmation. Bandhon Noors may cancel an order when stock is unavailable, customer information is incomplete, or the order cannot be fulfilled.",
        ],
      },
      {
        heading: "Pricing",
        paragraphs: [
          "Product prices and delivery charges shown during checkout apply to the submitted order. Obvious pricing or technical errors may require correction before fulfillment.",
        ],
      },
      {
        heading: "Customer Responsibilities",
        items: [
          "Provide accurate account and delivery information.",
          "Keep account credentials private.",
          "Do not misuse the website or attempt unauthorized access.",
          "Inspect delivered products and report material problems promptly.",
        ],
      },
      {
        heading: "Updates",
        paragraphs: [
          "These terms may be updated as store services, payment methods, and delivery arrangements change.",
        ],
      },
    ],
  },
};
