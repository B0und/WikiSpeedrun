import { useNavigate } from 'react-router';
import { useGameStoreActions } from '../GameStore';
import { queryClient } from '../components/Providers';
import { useStopwatchActions } from '../components/StopwatchContext';

export const useResetGame = () => {
  const navigate = useNavigate();
  const { resetStoreState } = useGameStoreActions();
  const { resetStopwatch } = useStopwatchActions();

  const resetGameFn = () => {
    resetStoreState();
    resetStopwatch();
    navigate('/settings');
    queryClient.invalidateQueries({ queryKey: ['article'] });
  };
  return resetGameFn;
};
