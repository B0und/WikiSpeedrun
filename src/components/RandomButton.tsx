import { useQuery } from '@tanstack/react-query';
import { ReactComponent as DiceIcon } from '../assets/dice.svg';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import clsx from 'clsx';

const getRandomArticles = async () => {
  const res = await fetch(
    `https://en.wikipedia.org/w/api.php?origin=%2A&action=query&format=json&generator=random&grnnamespace=0&grnlimit=10&prop=linkshere&lhnamespace=0&lhlimit=500&lhshow=%21redirect&lhprop=pageid`
  );
  return res.json();
};

interface RandomButtonProps {
  queryKey: string;
}
const RandomButton = ({ queryKey }: RandomButtonProps) => {
  const { data, refetch, isFetching } = useQuery({
    queryKey: ['randomButton', queryKey],
    queryFn: getRandomArticles,
    refetchOnWindowFocus: false,
    enabled: false,
    staleTime: 0,
  });

  console.log(data);

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
