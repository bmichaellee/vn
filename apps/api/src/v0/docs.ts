import openapi from "@elysiajs/openapi";

import { version } from "@Root/package.json";

const documentation = {
  info: {
    title: "VN - API",
    version,
    description: "API Documentation for a generic PWA",
  },
  tags: [
    {
      name: "System",
      description: "General system endpoints",
    },
    {
      name: "Users",
      description: "Users",
    },
  ],
};

export const docs = openapi({
  path: "/docs",
  documentation,
});
