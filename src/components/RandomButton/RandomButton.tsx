import { useQuery } from '@tanstack/react-query';
import { ReactComponent as DiceIcon } from '../../assets/dice.svg';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';
import { WikiRandom } from './RandomButton.types';
import { useI18nContext } from '../../i18n/i18n-react';

const getRandomArticles = async () => {
  const res = await fetch(
    'https://en.wikipedia.org/w/api.php?' +
      new URLSearchParams({
        origin: '*',
        action: 'query',
        format: 'json',
        generator: 'random',
        grnnamespace: '0',
        grnlimit: '10',
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
  const { LL } = useI18nContext();

  const { refetch, isFetching } = useQuery({
    queryKey: ['randomButton', queryKey],
    queryFn: getRandomArticles,
    refetchOnWindowFocus: false,
    enabled: false,
    staleTime: 0,
    onSuccess: onSuccess,
  });

  return (
    <button
      className={clsx('mb-[-2px] w-fit p-2', isFetching && 'animate-spin-dice')}
      type="button"
      onClick={() => refetch()}
    >
      <VisuallyHidden.Root>{LL.GET_RANDOM_ARTICLE()}</VisuallyHidden.Root>
      <DiceIcon />
    </button>
  );
};

export default RandomButton;
