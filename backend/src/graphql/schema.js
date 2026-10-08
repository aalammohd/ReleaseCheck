const typeDefs = `#graphql

  type Step {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Release {
    id: ID!
    name: String!
    dueDate: String!
    additionalInfo: String
    status: String!
    steps: [Step!]!
  }

  type Query {
    hello: String
    releases: [Release!]!
  }

  type Mutation {
    createRelease(
      name: String!
      dueDate: String!
      additionalInfo: String
    ): Release!

    updateChecklistStep(
      releaseId: ID!
      stepId: ID!
      completed: Boolean!
    ): Release!

    updateReleaseInfo(
  releaseId: ID!
  additionalInfo: String
): Release!

deleteRelease(
  releaseId: ID!
): Boolean!
  }

`;

export default typeDefs;