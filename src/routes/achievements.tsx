import { createFileRoute } from "@tanstack/react-router";

import { Achievements } from "../pages/Achievements";

export const Route = createFileRoute("/achievements")({
  component: Achievements,
});
