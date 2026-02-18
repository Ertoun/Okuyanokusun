export type UserType = 'Sude' | 'Ertan';

export interface PostStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  backgroundImage?: string;
}

export interface PostMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
}

export interface PostResponse {
  author: UserType;
  content: string;
  musicUrl?: string;
  createdAt: string;
}

export interface PostReactions {
  heart: number;
  sad: number;
  happy: number;
}

export interface PostData {
  _id: string;
  author: UserType;
  content: string;
  media: PostMedia[];
  style: PostStyle;
  responses: PostResponse[];
  reactions: PostReactions;
  createdAt: string;
}
