import type { CodegenConfig } from "@graphql-codegen/cli";

const schemaUrl =
  process.env.GRAPHQL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "https://kanban-graphql-api.onrender.com/graphql";

const config: CodegenConfig = {
  schema: schemaUrl,
  documents: ["src/graphql/**/*.graphql"],
  ignoreNoDocuments: true,
  generates: {
    "src/graphql/generated/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
    },
  },
};

export default config;
