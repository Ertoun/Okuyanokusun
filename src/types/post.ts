export type UserType = 'UserA' | 'UserB';

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

export interface PostData {
  _id: string;
  author: UserType;
  content: string;
  media: PostMedia[];
  style: PostStyle;
  responses: PostResponse[];
  createdAt: string;
}
