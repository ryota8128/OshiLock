import { useMutation } from '@tanstack/react-query';
import { postApi } from '@/api/post';
import type { CreatePostRequest } from '@oshilock/shared';

export function useCreatePost() {
  return useMutation({
    mutationFn: (input: CreatePostRequest) => postApi.create(input),
  });
}
