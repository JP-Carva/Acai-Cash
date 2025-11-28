export class ImageUtil {
    static isBase64(image: File) {
        throw new Error("Method not implemented.");
    }

    static base64ToFile(dataurl: string, filename: string): File {
        const arr = dataurl.split(',');
        const header = arr[0] || '';
        const base64 = arr[1] || '';
        const m = header.match(/:(.*?);/);
        const mime = m ? m[1] : 'application/octet-stream';
        const bstr = atob(base64);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }
}