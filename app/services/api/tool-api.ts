import { ApiResponse } from "apisauce"
import { Api } from "./api"
import { GetCharactersResult } from "./api.types"
import { getGeneralApiProblem } from "./api-problem"

const API_PAGE_SIZE = 50

const TEST_LIST = [
  {
    id: 1,
    name: 'Bohrmaschine',
    status: 'Ausgeliehen',
    condition: 'used'
  }
]
export class CharacterApi {
  private api: Api

  constructor(api: Api) {
    this.api = api
  }

  async getTools(): Promise<GetCharactersResult> {
    try {
      // make the api call
      // const response: ApiResponse<any> = await this.api.apisauce.get(
      //   "https://raw.githubusercontent.com/infinitered/ignite/master/data/rick-and-morty.json",
      //   { amount: API_PAGE_SIZE },
      // )

      // the typical ways to die when calling an api
      // if (!response.ok) {
      //   const problem = getGeneralApiProblem(response)
      //   if (problem) return problem
      // }

      const tools = TEST_LIST//response.data.results

      return { kind: "ok", tools }
    } catch (e) {
      __DEV__ && console.tron.log(e.message)
      return { kind: "bad-data" }
    }
  }
}
