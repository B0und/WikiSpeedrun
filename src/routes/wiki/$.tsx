import React from "react";

const Wiki = React.lazy(() => import("../../components/Wiki/Wiki"));

// The _splat param will contain the full wiki path after /wiki/
export const Route = createFileRoute({
  component: Wiki,
});
