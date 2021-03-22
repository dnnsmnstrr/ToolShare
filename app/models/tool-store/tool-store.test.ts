import { ToolStoreModel } from "./tool-store"

test("can be created", () => {
  const instance = ToolStoreModel.create({})

  expect(instance).toBeTruthy()
})
