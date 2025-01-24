import type { UploadProgressEvent } from './upload'
import type { RequestOptions } from './upload-content'

export function httpRequest(options: RequestOptions) {
  const xhr = new XMLHttpRequest()
  const action = options.action

  xhr.open(options.method, action, true)

  xhr.upload.addEventListener('progress', (e) => {
    const progressEvents = e as UploadProgressEvent
    progressEvents.percentage = e.total > 0 ? (e.loaded / e.total) * 100 : 0

    options.onProgress(progressEvents) // 调用上传进度
  })

  const headers = options.headers
  if (headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value)
    }
  }

  const formData = new FormData()
  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      formData.append(key, value)
    }
  }
  formData.append(options.name, options.file)

  xhr.onload = function () {
    if (xhr.status < 300 && xhr.status >= 200) {
      options.onSuccess(xhr.response)
    }
    else {
      options.onError({ status: xhr.status })
    }
  }

  xhr.addEventListener('error', (err) => {
    options.onError(err)
  })

  xhr.send(formData)

  return xhr
}
