import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { customRender, testWithMSW } from "../../test-extend";
import { router } from "../AppProviders";
import WikiDisplay from "./WikiDisplay";

//http://localhost:5173/wiki?state=%257B%2522history%2522%253A%255B%257B%2522title%2522%253A%2522Chahkanduk%252C%2520Birjand%2522%252C%2522time%2522%253A%257B%2522min%2522%253A%252200%2522%252C%2522sec%2522%253A%252200%2522%252C%2522ms%2522%253A%2522000%2522%257D%252C%2522winningLinks%2522%253A0%257D%255D%252C%2522startingArticle%2522%253A%257B%2522pageid%2522%253A%252235769150%2522%252C%2522title%2522%253A%2522Chahkanduk%252C%2520Birjand%2522%257D%252C%2522endingArticle%2522%253A%257B%2522pageid%2522%253A%252242510803%2522%252C%2522title%2522%253A%25222014%2520BRD%2520N%25C4%2583stase%2520%25C8%259Airiac%2520Trophy%2520%25E2%2580%2593%2520Doubles%2522%257D%257D
testWithMSW("Show/Hide button works correctly", async () => {
  const screen = customRender();
  await router.navigate({
    to: `/wiki/$`,
    params: {
      _splat: "Chahkanduk, Birjand",
    },
    search: {
      state: {
        history: [{ title: "Chahkanduk, Birjand", time: { min: "00", sec: "00", ms: "000" }, winningLinks: 0 }],
        startingArticle: { pageid: "35769150", title: "Chahkanduk, Birjand" },
        endingArticle: { pageid: "42510803", title: "2014 BRD Năstase Țiriac Trophy – Doubles" },
      },
    },
  });

  await screen
    .getByRole("columnheader", { name: "[show] v · t · e Iran Birjand County" })
    .click({ position: { x: 0, y: 0 } });
  await expect(screen.getByText("Alqurat")).toBeVisible();
});
