import { describe, it, expect } from "vitest";

const getStatus = (completedSteps, totalSteps = 7) => {
  if (completedSteps.length === totalSteps) {
    return "done";
  }

  if (completedSteps.length > 0) {
    return "ongoing";
  }

  return "planned";
};

describe("Release status", () => {
  it("should be planned when no steps are completed", () => {
    const status = getStatus([]);

    expect(status).toBe("planned");
  });

 it("should be done when all steps are completed", () => {
  const status = getStatus([1, 2, 3, 4, 5, 6, 7]);

  expect(status).toBe("done");
});
});