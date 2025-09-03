// Welcome to Keystone!
//
// This file is what Keystone uses as the entry-point to your headless backend
//
// Keystone imports the default export of this file, expecting a Keystone configuration object
//   you can find out more at https://keystonejs.com/docs/apis/config

import "dotenv/config";

import { config, graphql } from "@keystone-6/core";
import express from "express";

// to keep this file tidy, we define our schema in a different file
import { lists } from "./schema";

// authentication is configured separately here too, but you might move this elsewhere
// when you write your list-level access control functions, as they typically rely on session data
import { withAuth, session } from "./auth";

import getEnvVar from "./utils/getEnvVar";

const baseUrl = process.env.BACKEND_URL || "http://localhost:3000";

export default withAuth(
  config({
    server: {
      cors: {
        origin: [getEnvVar("FRONTEND_URL")],
        credentials: true,
      },
      extendExpressApp: (app) => {
        app.use(express.static("public"));
      },
    },
    db: {
      provider: "postgresql",
      url: getEnvVar("DATABASE_URL"),
    },
    lists,
    session,
    storage: {
      // The key here will be what is referenced in the image field
      localImages: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `${baseUrl}/image${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/image",
        },
        storagePath: "../keystone-images",
      },
    },
    graphql: {
      extendGraphqlSchema: graphql.extend((base) => {
        return {
          query: {
            getPopularPosts: graphql.field({
              type: graphql.list(graphql.nonNull(base.object("Post"))),
              args: {
                take: graphql.arg({ type: graphql.Int, defaultValue: 8 }),
              },
              async resolve(source, { take }, context) {
                const allPosts = await context.query.Post.findMany({
                  where: { status: { equals: "PUBLISHED" } },
                  query: "id popularScore",
                });

                const sortedPosts = allPosts
                  .sort((a, b) => {
                    return b.popularScore - a.popularScore;
                  })
                  .slice(0, take);

                const final = await context.query.Post.findMany({
                  where: {
                    id: { in: sortedPosts.map((post) => post.id) || [] },
                  },
                  query:
                    "title author { id name } slug id headerImage { image { url height width } } headerAltText blurb tags { name slug id }",
                });
                console.log({ final });
                return final;
              },
            }),
          },
        };
      }),
    },
  })
);
