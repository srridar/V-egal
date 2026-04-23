// Generate random ID (for temporary use)
export const generateId = () => {
  return Math.random().toString(36).substring(2, 10);
};




// Convert file to base64 (for upload)
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result as string);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};





// Format file size (bytes → KB/MB)
export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(2) + " KB";
  else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
};





// Check if string is empty
export const isEmpty = (value: string) => {
  return !value || value.trim() === "";
};