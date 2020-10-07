import { makeAutoObservable } from 'mobx'
import { GroupType } from '../constants'

export interface RequestItem {
  group: GroupType
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

  addRequest(
    group: GroupType,
    url: string,
    status: RequestStatus = RequestStatus.Pending
  ) {
    this.requests.push({ url, status, group })
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

  async prefetch() {
    this.requests.forEach(request => {
      if (request.status === RequestStatus.Pending) {
        fetch(request.url)
      }
    })
  }
}
