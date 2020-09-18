import { request } from 'http'
import { observable } from 'micro-observables'
import { GroupId } from '../groupConfigs'

export interface RequestItem {
  url: string
  status: RequestStatus
}

export enum RequestStatus {
  Pending,
  New,
  Cached
}

export class RequestStore {
  private _requests = observable<readonly RequestItem[]>([])

  readonly requests = this._requests.readOnly()
  readonly pendingRequests = this._requests.transform(requests =>
    requests.filter(x => x.status === RequestStatus.Pending)
  )
  readonly newRequests = this._requests.transform(requests =>
    requests.filter(x => x.status === RequestStatus.New)
  )
  readonly cachedRequests = this._requests.transform(requests =>
    requests.filter(x => x.status === RequestStatus.Cached)
  )
  readonly completedRequests = this._requests.transform(requests =>
    requests.filter(x => x.status !== RequestStatus.Pending)
  )
  readonly progress = this._requests.transform(
    requests =>
      requests.filter(x => x.status !== RequestStatus.Pending).length /
        requests.length || 0
  )
  readonly cachedProgress = this._requests.transform(
    requests =>
      requests.filter(x => x.status === RequestStatus.Cached).length /
        requests.length || 0
  )
  readonly newProgress = this._requests.transform(
    requests =>
      requests.filter(x => x.status === RequestStatus.New).length /
        requests.length || 0
  )

  addRequest(url: string, status: RequestStatus = RequestStatus.Pending) {
    this._requests.update(requests => [...requests, { url, status }])
  }

  updateRequest(url: string, status: RequestStatus) {
    this._requests.update(requests =>
      requests.map(request =>
        request.url === url && request.status !== RequestStatus.New
          ? { ...request, status }
          : request
      )
    )
  }

  reset() {
    this._requests.update(requests =>
      requests.map(request => ({ ...request, status: RequestStatus.Pending }))
    )
  }

  // addGroupRequest(
  //   groupId: GroupId,
  //   url: string,
  //   status: RequestStatus = RequestStatus.Pending
  // ) {
  //   this.addRequest(url, status)
  //   this._groupRequests.update(groupRequests => {
  //     if (!groupRequests.has(groupId)) {
  //       groupRequests.set(groupId, [])
  //     }

  //     const requests = groupRequests.get(groupId)!
  //     groupRequests.set(groupId, [...requests, { url, status }])

  //     return groupRequests
  //   })
  // }
}

export const requestStore = new RequestStore()
