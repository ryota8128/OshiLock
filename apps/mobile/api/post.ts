import { apiClient } from './client';
import type { CreatePostRequest, CreatePostResponse } from '@oshilock/shared';

export const postApi = {
  create(body: CreatePostRequest): Promise<CreatePostResponse> {
    return apiClient.post<CreatePostResponse>('/posts', body);
  },
};
