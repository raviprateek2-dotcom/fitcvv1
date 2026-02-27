/**
 * Shared file utilities used across the application.
 */

/**
 * Reads a File object as a base64 Data URL string.
 * Returns a Promise that resolves with the base64 string, replacing
 * the callback-based FileReader pattern.
 */
export function readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error('FileReader returned non-string result'));
            }
        };
        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
        reader.readAsDataURL(file);
    });
}

/**
 * Triggers a browser download of a base64-encoded file.
 */
export function downloadBase64File(base64: string, filename: string, mimeType: string): void {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}
