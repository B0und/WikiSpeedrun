import { useQuery } from '@tanstack/react-query';
import { ReactComponent as DiceIcon } from '../../assets/dice.svg';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { WikiRandom } from './RandomButton.types';

const getRandomArticles = async () => {
  const res = await fetch(
    'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        origin: '*',
        action: 'query',
        format: 'json',
        generator: 'random',
        grnnamespace: '0',
        grnlimit: '100',
        prop: 'linkshere',
        lhnamespace: '0',
        lhlimit: '500',
        lhshow: '!redirect',
        lhprop: 'pageid',
      })
  );
  return res.json() as WikiRandom;
};

interface RandomButtonProps {
  queryKey: string;
  onSuccess: (data: WikiRandom) => void;
}
const RandomButton = ({ queryKey, onSuccess }: RandomButtonProps) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['randomButton', queryKey],
    queryFn: getRandomArticles,
    refetchOnWindowFocus: false,
    enabled: false,
    staleTime: 0,
    onSuccess: onSuccess,
  });

  // console.log(data);

  return (
    <button
      className={clsx('w-fit p-2 pb-1', isFetching && 'animate-spin-dice')}
      type="button"
      onClick={() => refetch()}
    >
      <VisuallyHidden.Root>Get random article</VisuallyHidden.Root>
      <DiceIcon />
    </button>
  );
};

export default RandomButton;
