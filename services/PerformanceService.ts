// Performance optimization utilities for the SinaisApp

// Image optimization configuration
export const IMAGE_CONFIG = {
  defaultSource: require('../assets/adaptive-icon.png'), // Fallback image
  cachePolicy: 'memory-disk' as const,
  resizeMode: 'contain' as const,
};

// FlatList optimization configuration
export const FLATLIST_CONFIG = {
  initialNumToRender: 10,
  maxToRenderPerBatch: 10,
  windowSize: 10,
  removeClippedSubviews: true,
  updateCellsBatchingPeriod: 50,
};

// Debounce function to limit how often a function can be called
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Throttle function to limit how often a function can be called
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Memoization helper for expensive computations
export const memoize = <T extends (...args: any[]) => any>(func: T): T => {
  const cache = new Map<string, ReturnType<T>>();
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

// Performance monitoring helper
export const measurePerformance = (name: string, fn: () => void): void => {
  if (__DEV__) {
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    console.log(`[Performance] ${name} took ${endTime - startTime}ms`);
  } else {
    fn();
  }
};

// Helper to optimize FlatList performance
export const getOptimizedFlatListProps = (additionalProps?: any) => {
  return {
    ...FLATLIST_CONFIG,
    ...additionalProps,
  };
};

// Helper to optimize Image performance
export const getOptimizedImageProps = (additionalProps?: any) => {
  return {
    defaultSource: IMAGE_CONFIG.defaultSource,
    resizeMode: IMAGE_CONFIG.resizeMode,
    fadeDuration: 300,
    progressiveRenderingEnabled: true,
    ...additionalProps,
  };
};

// Lazy load images helper (placeholder for implementation)
export const setupLazyLoading = (): void => {
  console.log('Lazy loading setup would go here');
};

// Clear image cache helper (placeholder for implementation)
export const clearImageCache = (): void => {
  console.log('Image cache clearing would go here');
};

// Optimize animations helper (placeholder for implementation)
export const optimizeAnimations = (): void => {
  console.log('Animation optimization would go here');
};