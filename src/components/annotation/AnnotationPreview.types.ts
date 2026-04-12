export type PreviewType = 'image' | 'video' | 'audio' | 'document';

export interface PreviewData {
  type: PreviewType;
  url: string;
  title?: string;
}

export interface ImagePreviewProps {
  src: string;
  title?: string;
}

export interface VideoPreviewProps {
  src: string;
  title?: string;
  poster?: string;
}

export interface AudioPreviewProps {
  src: string;
  title?: string;
}

export interface DocumentPreviewProps {
  file: string;
  title?: string;
}

export interface AnnotationPreviewProps {
  data?: PreviewData | null;
}
