import { readFileAsDataURL, downloadBase64File } from '../file-utils';

describe('File Utils', () => {

  describe('readFileAsDataURL', () => {
    it('resolves with base64 string on successful read', async () => {
      // Mock File
      const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
      
      // We don't need to mock FileReader natively in JSDOM, it works.
      const result = await readFileAsDataURL(mockFile);
      expect(result).toContain('data:image/png;base64,');
    });

    it('rejects if file reading fails', async () => {
      const mockFile = new File([], 'error.png');
      
      // Mock FileReader to force an error
      const originalFileReader = global.FileReader;
      global.FileReader = class {
        onerror: (() => void) | null = null;
        readAsDataURL() {
          if (this.onerror) {
            this.onerror();
          }
        }
      } as any;

      await expect(readFileAsDataURL(mockFile)).rejects.toThrow('Failed to read file');

      // Restore original
      global.FileReader = originalFileReader;
    });
  });

  describe('downloadBase64File', () => {
    it('creates a link and triggers download', () => {
      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      
      const createObjectURLMock = jest.fn().mockReturnValue('blob:mock-url');
      const revokeObjectURLMock = jest.fn();
      
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      jest.spyOn(document.body, 'appendChild').mockImplementation(() => null as any);
      jest.spyOn(document.body, 'removeChild').mockImplementation(() => null as any);
      
      const base64Content = btoa('hello world'); // aGVsbG8gd29ybGQ=
      
      downloadBase64File(base64Content, 'test.txt', 'text/plain');
      
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockLink.download).toBe('test.txt');
      expect(mockLink.href).toBe('blob:mock-url');
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
    });
  });
});
