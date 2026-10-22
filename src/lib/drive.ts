/** Helpers for study files hosted on Google Drive. */

/** Extracts the file ID from any common Drive link, or returns the input if it is already an ID. */
export function driveFileId(linkOrId: string): string {
  const m = linkOrId.match(/\/d\/([\w-]{20,})/) || linkOrId.match(/[?&]id=([\w-]{20,})/);
  return m ? m[1] : linkOrId.trim();
}

/** Embeddable viewer (works for PPTX, PDF and Google Slides shared as "Anyone with the link"). */
export const drivePreviewUrl = (id: string) => `https://drive.google.com/file/d/${id}/preview`;

/** Direct download link. */
export const driveDownloadUrl = (id: string) => `https://drive.google.com/uc?export=download&id=${id}`;
