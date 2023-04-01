import { Resizable } from 're-resizable';
import { useClicks } from '../GameStore';
import HistoryTable from './HistoryTable';
import { Stopwatch } from './Stopwatch';

const Sidebar = () => {
  const clicks = useClicks();
  return (
    <>
      <Resizable
        defaultSize={{
          width: 400,
          height: '100%',
        }}
        minHeight="100%"
        minWidth={200}
        maxWidth={1000}
        className="border-r-[2px] border-secondary-blue  pr-3 pt-3 hover:border-r-[2px] hover:border-primary-blue"
        enable={{
          top: false,
          right: true,
          bottom: false,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div className="flex h-full w-full flex-col items-center justify-start gap-8">
          <HistoryTable />
          <div className="flex-wrap mt-auto flex w-full shrink-0 items-baseline justify-between overflow-auto pb-6 pr-6 ">
            <span>Clicks: {clicks}</span>
            <Stopwatch />
          </div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
