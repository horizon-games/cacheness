import { makeAutoObservable } from 'mobx'
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
  requests: RequestItem[] = []

  constructor() {
    makeAutoObservable(this)
  }

  get pendingRequests() {
    return this.requests.filter(x => x.status === RequestStatus.Pending)
  }
  get newRequests() {
    return this.requests.filter(x => x.status === RequestStatus.New)
  }
  get cachedRequests() {
    return this.requests.filter(x => x.status === RequestStatus.Cached)
  }
  get completedRequests() {
    return this.requests.filter(x => x.status !== RequestStatus.Pending)
  }
  get progress() {
    return (
      this.requests.filter(x => x.status !== RequestStatus.Pending).length /
        this.requests.length || 0
    )
  }
  get cachedProgress() {
    return (
      this.requests.filter(x => x.status === RequestStatus.Cached).length /
        this.requests.length || 0
    )
  }
  get newProgress() {
    return (
      this.requests.filter(x => x.status === RequestStatus.New).length /
        this.requests.length || 0
    )
  }

  addRequest(url: string, status: RequestStatus = RequestStatus.Pending) {
    this.requests.push({ url, status })
  }

  updateRequest(url: string, status: RequestStatus) {
    const request = this.requests.find(
      x => x.url === url && x.status !== RequestStatus.New
    )

    if (request) {
      request.status = status
    }
  }

  reset() {
    this.requests.forEach(request => {
      request.status = RequestStatus.Pending
    })
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
