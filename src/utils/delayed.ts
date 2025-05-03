export const randomTimeout = (): number => {
    const max = 1000;
    const min = 200;
    return Math.random() * (max - min) + min;
  };
  
  export const delayedRandomlyRejectingPromise = <T>(handler: () => T): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.75) {
          return reject(new Error("random error"));
        }
        try {
          resolve(handler());
        } catch (error) {
          reject(error);
        }
      }, randomTimeout());
    });
  };
  