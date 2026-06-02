import {
  FileText,
  Sheet,
  Presentation,
  FileType2,
  Folder,
  ImageIcon,
  Video,
  Music,
  File,
  LucideIcon
} from 'lucide-react';
import type { FileType } from '@/types/file.types';

export const FILE_TYPE_MAP: Record<string, { icon: LucideIcon, label: string, color: string, fileType: FileType }> = {
  'application/vnd.google-apps.document': { icon: FileText, label: 'Document', color: '#4285F4', fileType: 'DOCUMENT' },
  'application/vnd.google-apps.spreadsheet': { icon: Sheet, label: 'Spreadsheet', color: '#34A853', fileType: 'SPREADSHEET' },
  'application/vnd.google-apps.presentation': { icon: Presentation, label: 'Presentation', color: '#FBBC04', fileType: 'PRESENTATION' },
  'application/pdf': { icon: FileType2, label: 'PDF', color: '#EA4335', fileType: 'PDF' },
  'application/vnd.google-apps.folder': { icon: Folder, label: 'Folder', color: '#F6C026', fileType: 'FOLDER' },
};

export function getFileTypeInfo(mimeType: string) {
  if (FILE_TYPE_MAP[mimeType]) {
    return FILE_TYPE_MAP[mimeType];
  }
  if (mimeType.startsWith('image/')) {
    return { icon: ImageIcon, label: 'Image', color: '#0EA5E9', fileType: 'IMAGE' as FileType };
  }
  if (mimeType.startsWith('video/')) {
    return { icon: Video, label: 'Video', color: '#8B5CF6', fileType: 'VIDEO' as FileType };
  }
  if (mimeType.startsWith('audio/')) {
    return { icon: Music, label: 'Audio', color: '#EC4899', fileType: 'AUDIO' as FileType };
  }
  return { icon: File, label: 'File', color: '#6B7280', fileType: 'OTHER' as FileType };
}
