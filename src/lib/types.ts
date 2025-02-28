
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Celebrity {
  id: string;
  name: string;
  image: string;
  matchPercentage: number;
}

export interface CelebrityMatch {
  id: string;
  userId: string;
  userImage: string;
  celebrities: Celebrity[];
  createdAt: Date;
}

export type UploadStatus = 'idle' | 'uploading' | 'processing' | 'success' | 'error';
