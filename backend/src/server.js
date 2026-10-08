import express from "express";
import prisma from "./prisma.js";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

import typeDefs from "./graphql/schema.js";
import CHECKLIST_STEPS from "./constants/steps.js";

const app = express();

app.use(cors());
app.use(express.json());

const resolvers = {
  Query: {
    hello: () => "Hello from ReleaseCheck GraphQL!",

    releases: async () => {
      const releases = await prisma.release.findMany({
        orderBy: {
          dueDate: "asc"
        }
      });

      return releases.map((release) => {
        const completedSteps = release.completedSteps || [];

        let status = "planned";

        if (completedSteps.length === CHECKLIST_STEPS.length) {
          status = "done";
        } else if (completedSteps.length > 0) {
          status = "ongoing";
        }

        return {
          ...release,
          dueDate: release.dueDate.toISOString(),
          status,
          steps: CHECKLIST_STEPS.map((step) => ({
            ...step,
            completed: completedSteps.includes(step.id)
          }))
        };
      });
    }
  },

  Mutation: {
    createRelease: async (_, args) => {
      const release = await prisma.release.create({
        data: {
          name: args.name,
          dueDate: new Date(args.dueDate),
          additionalInfo: args.additionalInfo || null,
          completedSteps: []
        }
      });

      return {
        ...release,
        dueDate: release.dueDate.toISOString(),
        status: "planned",
        steps: CHECKLIST_STEPS.map((step) => ({
          ...step,
          completed: false
        }))
      };
    },

    updateChecklistStep: async (_, args) => {
      const releaseId = Number(args.releaseId);
      const stepId = Number(args.stepId);

      const release = await prisma.release.findUnique({
        where: {
          id: releaseId
        }
      });

      if (!release) {
        throw new Error("Release not found");
      }

      const completedSteps = Array.isArray(release.completedSteps)
        ? release.completedSteps
        : [];

      let updatedSteps;

      if (args.completed) {
        updatedSteps = completedSteps.includes(stepId)
          ? completedSteps
          : [...completedSteps, stepId];
      } else {
        updatedSteps = completedSteps.filter((id) => id !== stepId);
      }

      const updatedRelease = await prisma.release.update({
        where: {
          id: releaseId
        },
        data: {
          completedSteps: updatedSteps
        }
      });

      let status = "planned";

      if (updatedSteps.length === CHECKLIST_STEPS.length) {
        status = "done";
      } else if (updatedSteps.length > 0) {
        status = "ongoing";
      }

      return {
        ...updatedRelease,
        dueDate: updatedRelease.dueDate.toISOString(),
        status,
        steps: CHECKLIST_STEPS.map((step) => ({
          ...step,
          completed: updatedSteps.includes(step.id)
        }))
      };
    },

    updateReleaseInfo: async (_, args) => {
      const releaseId = Number(args.releaseId);

      const release = await prisma.release.update({
        where: {
          id: releaseId
        },
        data: {
          additionalInfo: args.additionalInfo || null
        }
      });

      const completedSteps = Array.isArray(release.completedSteps)
        ? release.completedSteps
        : [];

      let status = "planned";

      if (completedSteps.length === CHECKLIST_STEPS.length) {
        status = "done";
      } else if (completedSteps.length > 0) {
        status = "ongoing";
      }

      return {
        ...release,
        dueDate: release.dueDate.toISOString(),
        status,
        steps: CHECKLIST_STEPS.map((step) => ({
          ...step,
          completed: completedSteps.includes(step.id)
        }))
      };
    },

    deleteRelease: async (_, args) => {
      const releaseId = Number(args.releaseId);

      const release = await prisma.release.findUnique({
        where: {
          id: releaseId
        }
      });

      if (!release) {
        throw new Error("Release not found");
      }

      await prisma.release.delete({
        where: {
          id: releaseId
        }
      });

      return true;
    }
  }
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
});

const startServer = async () => {
  await apolloServer.start();

  app.use(
    "/graphql",
    expressMiddleware(apolloServer)
  );

  app.get("/", (req, res) => {
    res.json({
      message: "ReleaseCheck Backend is running"
    });
  });

const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL running on http://localhost:${PORT}/graphql`);
  });
};

startServer();