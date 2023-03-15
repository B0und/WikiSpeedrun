import { useEffect } from 'react';
import { useStopwatchActions } from '../StopwatchContext';

export const usePauseWhileLoading = (isLoading: boolean) => {
  const { pause } = useStopwatchActions();
  useEffect(() => {
    if (isLoading) {
      pause();
    }
  }, [isLoading, pause]);
};
