import { Instance, SnapshotOut, types } from "mobx-state-tree"

/**
 * Tool model.
 */
export const ToolModel = types.model("Tool").props({
  id: types.identifierNumber,
  name: types.maybe(types.string),
  status: types.maybe(types.string),
  image: types.maybe(types.string),
  condition: types.maybe(types.string),
  location: types.maybe(types.string),
})

type ToolType = Instance<typeof ToolModel>
export interface Tool extends ToolType {}
type ToolSnapshotType = SnapshotOut<typeof ToolModel>
export interface ToolSnapshot extends ToolSnapshotType {}
export const createToolDefaultModel = () => types.optional(ToolModel, {})
