import 'vitest';

declare module 'axios' {
  interface AxiosStatic {
    get: jest.MockedFunction<(url: string, config?: any) => Promise<any>>;
    post: jest.MockedFunction<(url: string, data?: any, config?: any) => Promise<any>>;
    put: jest.MockedFunction<(url: string, data?: any, config?: any) => Promise<any>>;
    delete: jest.MockedFunction<(url: string, config?: any) => Promise<any>>;
    patch: jest.MockedFunction<(url: string, data?: any, config?: any) => Promise<any>>;
  }
}

declare global {
  namespace jest {
    interface MockedFunction<T extends (...args: any[]) => any> {
      mockResolvedValue(value: Awaited<ReturnType<T>>): this;
      mockRejectedValue(value: any): this;
    }
  }
}