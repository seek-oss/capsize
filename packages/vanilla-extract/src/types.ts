import { createStyleObject, computeValues } from '@capsizecss/core';

export type CreateStyleObjectParameters = Parameters<
  typeof createStyleObject
>[0];
export type ComputedValues = ReturnType<typeof computeValues>;
