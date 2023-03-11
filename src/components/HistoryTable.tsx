const HistoryTable = () => {
  const temp = [
    { name: "asdasd", time: "00:00.123" },
    { name: "sad123", time: "00:00.678" },
    {
      name: "List of cities founded by Alexander the Great",
      time: "00:33.123",
    },
    { name: "cvbcvb3455t", time: "00:00.867" },
    { name: "cvbcvb3455t", time: "00:00.867" },

    { name: "dfgdfg dfgdfg 45 gd fg", time: "00:00.345" },
    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "00:02.934" },
    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "00:23.934" },

    {
      name: "asdassd fsdf sdf sdf fs  вапвап вап вапвап23 sdf d",
      time: "00:55.934",
    },
    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "00:67.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "01:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },
    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:10.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },
    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },

    { name: "asdassd fsdf sdf sdf fs 23 sdf d", time: "34:00.934" },
  ];
  return (
    <div className="overflow-y-auto">
      <table className="table-auto mb-auto ">
        <caption className="text-start pb-2 text-xl">History</caption>
        <thead className="sticky top-0 bg-white">
          <tr>
            <th className="text-start">Article</th>
            <th className="text-start">Time</th>
          </tr>
        </thead>
        <tbody>
          {/* todo change key to time */}
          {temp.map((d, ind) => (
            <tr key={ind}>
              <td className="pr-4 py-2">{d.name}</td>
              <td className="pr-4 py-2">{d.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;
