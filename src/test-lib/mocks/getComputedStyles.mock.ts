Object.defineProperty(window, 'getComputedStyle', {
  value: (): string[] => ['-webkit-appearance']
});
