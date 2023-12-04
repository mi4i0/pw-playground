/* eslint-disable @typescript-eslint/no-explicit-any */
import { APIRequestContext, APIResponse, request } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export async function getRequest<T>(
  url: string,
  params?: { [key: string]: string },
  headers?: {
    [key: string]: string;
  },
): Promise<T> {
  return httpRequest<T>({
    method: 'GET',
    url,
    isFormData: false,
    headers,
  });
}

export async function postRequest<T>(
  url: string,
  body?: any,
  isFormData: boolean = false,
  fileKeyName?: string,
  headers?: {
    [key: string]: string;
  },
): Promise<T> {
  return await httpRequest({
    method: 'POST',
    url,
    body,
    isFormData,
    fileKeyName,
    headers,
  });
}

export async function patchRequest<T>(
  url: string,
  body: any,
  isFormData: boolean = false,
  fileKeyName?: string,
  headers?: {
    [key: string]: string;
  },
): Promise<T> {
  return await httpRequest<T>({
    method: 'PATCH',
    url,
    body,
    isFormData,
    fileKeyName,
    headers,
  });
}

export async function putRequest<T>(
  url: string,
  body: any,
  isFormData: boolean = false,
  fileKeyName?: string,
  headers?: {
    [key: string]: string;
  },
): Promise<T> {
  return await httpRequest<T>({
    method: 'PUT',
    url,
    body,
    isFormData,
    fileKeyName,
    headers,
  });
}

export async function deleteRequest<T>(
  url: string,
  body?: any,
  isFormData: boolean = false,
  fileKeyName?: string,
  headers?: {
    [key: string]: string;
  },
): Promise<T> {
  return await httpRequest<T>({
    method: 'DELETE',
    url,
    body,
    isFormData,
    fileKeyName,
    headers,
  });
}

async function httpRequest<T>({
  method,
  url,
  body,
  isFormData,
  fileKeyName,
  headers
}: HttpRequestOptions): Promise<T> {
  const apiRequestContext: APIRequestContext = await request.newContext();

  let response: APIResponse;

  if (isFormData && fileKeyName) {
    const stream: fs.ReadStream = fs.createReadStream(path.resolve(`./${body[fileKeyName]}`));
    const fileToUpload: {} = {};
    fileToUpload[fileKeyName] = stream;
    response = await apiRequestContext.fetch(url, {
      method,
      headers: headers,
      multipart: {
        ...body,
        ...fileToUpload,
      },
    });
  }

  if (isFormData && !fileKeyName) {
    response = await apiRequestContext.fetch(url, {
      method,
      headers,
      form: body,
    });
  }

  if (!isFormData) {
    response = await apiRequestContext.fetch(url, {
      method,
      headers,
      data: body,
    });
  }
  _responseCodeValidation(response, url, method);

  const responseBody: Buffer = await response.body();
  const responseAsString: string = responseBody.toString();

  // for cases when post/patch requests return empty body as in lms/invites/clear case
  if (!responseAsString) {
    return;
  }

  await apiRequestContext.dispose();
  return JSON.parse(responseAsString) as unknown as Promise<T>;
}

function _getErrorMessage(status: number, url: string, method: string, body: string): string {
  const messageMap: { [key: number]: string } = {
    400: '🧨Bad Request 🧨',
    401: '🧨 Unauthorized 🧨',
    403: '🧨Forbidden, check user permissions 🧨',
    404: '🧨Not Found 🧨',
    405: '🧨Method Not Allowed 🧨',
    500: '🧨Internal Server Error 🧨',
  };

  const defaultMessage: string = '🧨Unexpected Error 🧨';

  return `URL: ${url};
    Status: ${status} - ${messageMap[status] || defaultMessage};
    Body: ${body};
    Method: ${method}`;
}

function _responseCodeValidation(response: APIResponse, url: string, method: string): void {
  const status: number = Number(response.status);

  if (status >= 400 || status < 200) {
    throw Error(_getErrorMessage(status, url, method, response.body.toString()));
  }
}

interface HttpRequestOptions {
  method: string;
  url: string;
  body?: any;
  isFormData?: boolean;
  fileKeyName?: string;
  headers?: { [key: string]: string };
}
