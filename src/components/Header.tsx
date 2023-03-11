import React from "react";

const Header = () => {
  return (
    <div>
      <img
        src={window.location.origin + "/wiki-speed-logo.png"}
        alt="Wikipedia Speedrun"
        width={128}
        height={168}
      />
      Header
    </div>
  );
};

export default Header;
