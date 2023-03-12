import { Resizable } from 're-resizable';
import HistoryTable from './HistoryTable';
import Stopwatch from './Stopwatch';

const Sidebar = () => {
  return (
    <>
      <Resizable
        defaultSize={{
          width: 400,
          height: '100%',
        }}
        minHeight="100%"
        minWidth={220}
        maxWidth={1000}
        className="border-r-[2px] border-secondary-blue  pt-3 pr-3 hover:border-r-[2px] hover:border-primary-blue"
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
          <div className="mt-auto flex w-full items-baseline justify-between pb-6 pr-6">
            <span>Clicks: 10</span>
            <Stopwatch />
          </div>
        </div>
      </Resizable>
    </>
  );
};

export default Sidebar;
