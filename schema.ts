// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list, graphql } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import slugify from "slugify";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  checkbox,
  select,
  integer,
  float,
  virtual,
  image,
} from "@keystone-6/core/fields";
import { cloudinaryImage } from "@keystone-6/cloudinary";

// the document field is a more complicated field, so it has it's own package
import { document } from "@keystone-6/fields-document";
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types";

import { componentBlocks } from "./componentBlocks";
import { DateTime } from "@keystone-6/core/dist/declarations/src/types/schema/graphql-ts-schema";

import getEnvVar from "./utils/getEnvVar";

export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({
        validation: { isRequired: true },
        // graphql: { omit: true },
      }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({ ref: "Post.author", many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
        graphql: {
          omit: {
            create: true,
            update: true,
          },
        },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      status: select({
        options: ["DRAFT", "PUBLISHED"],
        defaultValue: "DRAFT",
        ui: {
          displayMode: "segmented-control",
        },
      }),
      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
        graphql: {
          omit: {
            create: true,
            update: true,
          },
        },
      }),
      publishedAt: timestamp({
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          // update to only display if not null
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      updatedAt: timestamp({
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      views: integer({
        validation: { isRequired: true, min: 0 },
        defaultValue: 0,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          // update to only display if not null
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      uniqueVisitors: integer({
        validation: { isRequired: true, min: 0 },
        defaultValue: 0,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          // update to only display if not null
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      avgTimeOnPage: integer({
        validation: { isRequired: true, min: 0 },
        defaultValue: 0,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          // update to only display if not null
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),

      title: text({ validation: { isRequired: true } }),
      slug: text({
        isIndexed: "unique",
        isFilterable: true,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] },
        },
      }),
      keywords: text(),
      featured: checkbox(),
      weight: float({
        validation: { isRequired: true, min: 0, max: 2 },
        defaultValue: 1,
      }),

      // headerImage: cloudinaryImage({
      //   cloudinary: {
      //     cloudName: getEnvVar("CLOUDINARY_CLOUD_NAME"),
      //     apiKey: getEnvVar("CLOUDINARY_API_KEY"),
      //     apiSecret: getEnvVar("CLOUDINARY_API_SECRET"),
      //     folder: "flightlessnerd-dev",
      //   },
      // }),

      headerImage: relationship({
        ref: "Image",
        many: false,
        ui: {
          displayMode: "cards",
          cardFields: ["image"],
          linkToItem: true,
          inlineCreate: {
            fields: ["name", "altText", "image"],
          },
          inlineConnect: true,
        },
      }),

      headerImageAttribution: text(),
      headerImageAttributionUrl: text(),
      headerAltText: text({
        validation: { isRequired: true },
        defaultValue: "Header image",
      }),

      blurb: text({
        validation: { length: { max: 200 } },
        ui: {
          displayMode: "textarea",
        },
      }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        relationships: {
          mention: {
            listKey: "User",
            selection: "id name",
            label: "Mention",
          },
          postMention: {
            listKey: "Post",
            selection: "id title",
            label: "Post Mention",
          },
        },
        ui: {
          views: "./componentBlocks",
        },
        componentBlocks,
      }),
      popularScore: virtual({
        field: graphql.field({
          type: graphql.Float,
          resolve(item, args, context) {
            const { views, uniqueVisitors, publishedAt } = item;
            const janOneTwentyFive = 1735711200;
            const publishSeconds = Math.floor(
              new Date(publishedAt || Date.now()).getTime() / 1000
            );
            const freshness =
              (publishSeconds - janOneTwentyFive) / (60 * 60 * 24 * 14); // seconds in 14 days

            let sumViews = views + uniqueVisitors;

            if (sumViews === 0) sumViews = 1;

            const score = Math.log10(sumViews) + freshness;

            return score || 0;
          },
        }),
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldMode: "hidden",
          },
        },
      }),
      relatedScore: virtual({
        field: graphql.field({
          type: graphql.Float,
          args: {
            keywords: graphql.arg({
              type: graphql.nonNull(graphql.String),
              defaultValue: "Video Games",
            }),
          },
          resolve(item, args, context) {
            const compKeywords = args.keywords
              .split(",")
              .map((kw) => kw.trim().toLowerCase());
            const title = (item.title ?? "").toLowerCase();
            const blurb = (item.blurb ?? "").toLowerCase();
            const keywords = item.keywords
              ? item.keywords.split(",").map((kw) => kw.trim().toLowerCase())
              : [];
            let score = 0;
            compKeywords.forEach((kw) => {
              if (title.includes(kw)) score += 5;
              if (blurb.includes(kw)) score += 3;
              if (keywords.includes(kw)) score += 1;
            });
            return score || 0;
          },
        }),
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldMode: "hidden",
          },
        },
      }),
      relatedPosts: virtual({
        field: (lists) =>
          graphql.field({
            type: graphql.list(lists.Post.types.output),
            args: {
              take: graphql.arg({
                type: graphql.Int,
                defaultValue: 10,
              }),
            },
            async resolve(item, { take }, context) {
              const posts = await context.query.Post.findMany({
                where: {
                  id: { not: { equals: item.id } },
                  status: { equals: "PUBLISHED" },
                },
                query: `title id slug headerImage { image { url height width } } headerAltText relatedScore(keywords: "${item.keywords}")`,
              });

              const topPosts = posts
                .sort((a, b) => a.relatedScore > b.relatedScore)
                .slice(0, take);

              return topPosts;
            },
          }),
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          listView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldMode: "hidden",
          },
        },
      }),
    },
    ui: {
      listView: {
        initialColumns: [
          "title",
          "createdAt",
          "tags",
          "author",
          "status",
          "publishedAt",
        ],
      },
    },

    hooks: {
      resolveInput: ({ operation, item, inputData, resolvedData }) => {
        let returnData = { ...resolvedData };

        // update updatedAt field for every update
        if (
          !inputData.views &&
          !inputData.avgTimeOnPage &&
          !inputData.uniqueVisitors
        ) {
          returnData.updatedAt = new Date(Date.now());
        }

        // set publishedAt when status is changed to PUBLISHED and publishedAt is null
        if (inputData.status === "PUBLISHED" && !item?.publishedAt) {
          returnData.publishedAt = new Date(Date.now());
        }

        // create a slug on initial creation
        if (operation === "create") {
          returnData.slug = slugify(inputData.title ?? "", {
            remove: /[*+~.()'"!:@]/g,
          }).toLowerCase();
        }

        return returnData;
      },
    },
  }),

  Page: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our Post list
    fields: {
      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
        graphql: {
          omit: {
            create: true,
            update: true,
          },
        },
      }),
      updatedAt: timestamp({
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
      title: text({ validation: { isRequired: true } }),
      slug: text({
        isIndexed: "unique",
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),

      // the document field can be used for making rich editable content
      //   you can find out more at https://keystonejs.com/docs/guides/document-fields
      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
        ui: {
          views: "./componentBlocks",
        },
        componentBlocks,
      }),
      headerImage: cloudinaryImage({
        cloudinary: {
          cloudName: process.env.CLOUDINARY_CLOUD_NAME || "dpilch",
          apiKey: process.env.CLOUDINARY_API_KEY || "182646975456438",
          apiSecret:
            process.env.CLOUDINARY_API_SECRET || "7umM4KhC5ykM44nuAYLSozgtN2w",
          folder: "flightlessnerd-dev",
        },
      }),
      headerImageAttribution: text(),
      headerImageAttributionUrl: text(),
    },
    ui: {
      listView: {
        initialColumns: ["title", "slug", "updatedAt"],
      },
    },
    hooks: {
      resolveInput: ({ operation, inputData, resolvedData }) => {
        let returnData = { ...resolvedData };

        // create a slug on initial creation
        if (
          operation === "create" ||
          (operation === "update" && inputData.slug === null)
        ) {
          returnData.slug = slugify(inputData.title ?? "", {
            remove: /[*+~.()'"!:@]/g,
          }).toLowerCase();
        }

        return returnData;
      },
    },
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text({ validation: { isRequired: true }, defaultValue: "" }),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: "Post.tags", many: true }),
      slug: text({
        isIndexed: "unique",
        isFilterable: true,
        ui: {
          createView: {
            fieldMode: "hidden",
          },
          itemView: {
            fieldPosition: "sidebar",
            fieldMode: "read",
          },
        },
      }),
    },
    hooks: {
      resolveInput: ({ operation, inputData, resolvedData }) => {
        let returnData = { ...resolvedData };

        // create a slug on initial creation
        if (
          operation === "create" ||
          (operation === "update" &&
            (inputData.slug === null ||
              inputData.slug !==
                slugify(inputData.name, { remove: /[*+~.()'"!:@]/g })))
        ) {
          returnData.slug = slugify(inputData.name ?? "", {
            remove: /[*+~.()'"!:@]/g,
          }).toLowerCase();
        }

        return returnData;
      },
    },
  }),
  Image: list({
    access: allowAll,
    fields: {
      name: text({
        validation: {
          isRequired: true,
        },
      }),
      altText: text(),
      image: image({ storage: "localImages" }),
    },
  }),
};
