import { type HttpResponse } from '../../@types/http'

function httpRes<T> (statusCode: number, body: T): HttpResponse {
  return {
    statusCode,
    body
  }
}

export const serverError = <T>(data: T): HttpResponse => httpRes(500, data)
export const noContent = (): HttpResponse => httpRes(204, null)
export const badRequest = <T>(data: T): HttpResponse => httpRes(400, data)
export const ok = <T>(data: T): HttpResponse => httpRes(200, data)