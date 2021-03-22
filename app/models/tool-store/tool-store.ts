import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ToolModel, ToolSnapshot } from "../tool/tool"
import { ToolApi } from "../../services/api/tool-api"
import { withEnvironment } from "../extensions/with-environment"

/**
 * Example store containing tools
 */
export const ToolStoreModel = types
  .model("ToolStore")
  .props({
    tools: types.optional(types.array(ToolModel), []),
  })
  .extend(withEnvironment)
  .actions((self) => ({
    saveTools: (toolSnapshots: ToolSnapshot[]) => {
      self.tools.replace(toolSnapshots)
    },
  }))
  .actions((self) => ({
    getTools: async () => {
      const toolApi = new ToolApi(self.environment.api)
      const result = await toolApi.getTools()

      if (result.kind === "ok") {
        self.saveTools(result.tools)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    },
  }))

type ToolStoreType = Instance<typeof ToolStoreModel>
export interface ToolStore extends ToolStoreType {}
type ToolStoreSnapshotType = SnapshotOut<typeof ToolStoreModel>
export interface ToolStoreSnapshot extends ToolStoreSnapshotType {}
export const createToolStoreDefaultModel = () => types.optional(ToolStoreModel, {})
