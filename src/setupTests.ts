import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Polyfill for TextEncoder/TextDecoder
if (typeof global.TextEncoder === 'undefined') {
  class TextEncoderPolyfill {
    encode(str: string) {
      const arr = new Uint8Array(str.length);
      for (let i = 0; i < str.length; i++) {
        arr[i] = str.charCodeAt(i);
      }
      return arr;
    }
  }
  global.TextEncoder = TextEncoderPolyfill as any;
}

if (typeof global.TextDecoder === 'undefined') {
  class TextDecoderPolyfill {
    decode(arr: Uint8Array) {
      return String.fromCharCode.apply(null, Array.from(arr));
    }
  }
  global.TextDecoder = TextDecoderPolyfill as any;
}

// Automatically cleanup after each test
afterEach(() => {
  cleanup();
}); 