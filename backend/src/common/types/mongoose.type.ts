import type { Document as Doc, Types } from 'mongoose';

export type Document<T> = Doc<unknown, {}, T> &
  Omit<
    T & {
      _id: Types.ObjectId;
    },
    never
  >;
