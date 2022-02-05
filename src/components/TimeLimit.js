import { TimeInput } from "@mantine/dates";
import styled from "@emotion/styled";

const TimeLimit = ({ time, setTime }) => {
  return (
    <StyledTime
      value={time}
      onChange={setTime}
      label="Time limit [h:m:s]"
      withSeconds
      hoursLabel="Hours"
      minutesLabel="Minutes"
      seconds="Seconds"
    />
  );
};

const StyledTime = styled(TimeInput)`
  max-width: 120px;
`;

export default TimeLimit;
