import { GroupId } from '../groupConfigs'
import { observable } from 'micro-observables'

class AssetStore {
  groupProgress = observable<Map<GroupId, number>>(new Map())

  setGroupProgress(group: GroupId, value: number) {
    //this.groupProgress.update(x => x.set())
  }
}

export const assetStore = new AssetStore()
