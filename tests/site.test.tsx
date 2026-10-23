import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import {
  cleanup,
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/site/App";
import {
  properties,
  filterHomes,
  initialFilters,
  mortgagePayment,
} from "../src/site/data";
vi.mock("../src/site/PropertyMap", () => ({
  default: () => <div>Property map</div>,
}));
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal("matchMedia", () => ({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()}));
  vi.stubGlobal("scrollTo", vi.fn());
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
const show = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
describe("catalogue and financing", () => {
  test("fifty homes are added to the original four, each with four image views", () => {
    expect(properties).toHaveLength(54);
    expect(new Set(properties.map((p) => p.id)).size).toBe(54);
    expect(new Set(properties.map((p) => p.images[0])).size).toBe(54);
    for (const p of properties) {
      expect(p.images).toHaveLength(4);
      expect(p.imageLabels).toEqual([
        "Exterior",
        "Living room",
        "Kitchen",
        "Bedroom",
      ]);
      expect(p.demo).toBe(true);
      expect(p.price).toBeGreaterThan(0);
    }
  });
  test("query, type, bedrooms and prices combine without mutating data", () => {
    const rows = filterHomes(properties, {
      ...initialFilters,
      status: "All listings",
      query: "Toronto Annex",
      type: "Condo",
      minBeds: 2,
      minPrice: 100000,
      maxPrice: 1000000,
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].neighbourhood).toBe("The Annex");
    expect(properties).toHaveLength(54);
    expect(
      filterHomes(properties, { ...initialFilters, query: "no such place" }),
    ).toHaveLength(0);
  });
  test("mortgage uses Canadian semi-annual compounding and handles zero interest", () => {
    expect(mortgagePayment(800000, 4.5, 25)).toBeCloseTo(4427.82, 0);
    expect(mortgagePayment(120000, 0, 10)).toBe(1000);
    expect(mortgagePayment(0, 5, 25)).toBe(0);
  });
});
test("all listings can be searched, filtered and reset from no results", async () => {
  const u = userEvent.setup();
  show("/find-your-home?status=All+listings");
  expect(screen.getByRole("status").textContent).toContain("54");
  await u.type(
    screen.getByRole("textbox", { name: "Search properties" }),
    "Annex",
  );
  expect(screen.getByRole("status").textContent).toContain("6");
  await u.selectOptions(
    screen.getByRole("combobox", { name: "Property type" }),
    "Condo",
  );
  expect(screen.getByRole("status").textContent).toContain("1 home");
  await u.clear(screen.getByRole("textbox", { name: "Search properties" }));
  await u.type(
    screen.getByRole("textbox", { name: "Search properties" }),
    "no matches",
  );
  expect(screen.getByText("No homes match these filters.")).toBeTruthy();
  await u.click(screen.getByRole("button", { name: "Clear all filters" }));
  expect(screen.getByRole("status").textContent).toContain("54");
});
test("saved homes persist and appear on the saved page", async () => {
  const u = userEvent.setup();
  show("/property/1");
  await u.click(screen.getByRole("button", { name: "Save 12 Cedarview Lane" }));
  expect(JSON.parse(localStorage.getItem("lechat-saved-v2")!)).toEqual(["1"]);
  await u.click(screen.getByRole("link", { name: /Saved 1/ }));
  expect(
    screen.getByRole("heading", { name: "12 Cedarview Lane" }),
  ).toBeTruthy();
  await u.click(
    screen.getByRole("button", { name: "Unsave 12 Cedarview Lane" }),
  );
  expect(
    screen.getByRole("heading", { name: "Your shortlist starts here." }),
  ).toBeTruthy();
});
test("gallery opens, advances photos and notes survive a reload", async () => {
  const u = userEvent.setup();
  const app = show("/property/1");
  await u.click(screen.getByRole("button", { name: "Open Exterior photo" }));
  const d = screen.getByRole("dialog");
  expect(within(d).getByText("1 / 4")).toBeTruthy();
  await u.click(within(d).getByRole("button", { name: "Next photo" }));
  expect(within(d).getByText("2 / 4")).toBeTruthy();
  await u.click(within(d).getByRole("button", { name: "Close gallery" }));
  expect(d.hasAttribute("open")).toBe(false);
  await u.type(
    screen.getByRole("textbox", { name: "Private notes for this property" }),
    "Ask about morning light.",
  );
  app.unmount();
  show("/property/1");
  expect(
    (
      screen.getByRole("textbox", {
        name: "Private notes for this property",
      }) as HTMLTextAreaElement
    ).value,
  ).toBe("Ask about morning light.");
});
test("mortgage controls change the estimate", () => {
  show("/mortgage-calculator");
  const before = screen.getByLabelText(
    "Estimated mortgage payment",
  ).textContent;
  fireEvent.change(screen.getByLabelText("Annual interest rate"), {
    target: { value: "0" },
  });
  expect(
    screen.getByLabelText("Estimated mortgage payment").textContent,
  ).not.toBe(before);
  expect(screen.getByLabelText("Estimated mortgage payment").textContent).toBe(
    "$2,667",
  );
});
test("contact form prepares a reviewable email without claiming submission", async () => {
  const u = userEvent.setup();
  show("/contact?property=12%20Cedarview%20Lane");
  await u.type(screen.getByLabelText("Your name"), "Alex Buyer");
  await u.type(screen.getByLabelText("Email address"), "alex@example.com");
  await u.type(
    screen.getByLabelText("What would you like us to know?"),
    "I would like to discuss my search.",
  );
  await u.click(screen.getByRole("button", { name: "Prepare my email" }));
  const link = screen.getByRole("link", { name: "Open email draft" });
  expect(link.getAttribute("href")).toContain("mailto:johnparker@rogers.com");
  expect(decodeURIComponent(link.getAttribute("href")!)).toContain(
    "12 Cedarview Lane",
  );
  expect(screen.getByText("Your email is ready to review.")).toBeTruthy();
});
test.each(["/about", "/buy", "/sell", "/neighbourhoods", "/new-listings"])(
  "%s has a complete main page",
  (path) => {
    show(path);
    expect(screen.getByRole("main").textContent!.length).toBeGreaterThan(500);
    expect(
      within(screen.getByRole("main")).getAllByRole("heading", { level: 1 }),
    ).toHaveLength(1);
  },
);

test("private notes stay attached to the home when opening a related property", async () => {
  const u = userEvent.setup();
  show("/property/1");
  await u.type(
    screen.getByRole("textbox", { name: "Private notes for this property" }),
    "Only for the first home.",
  );
  await u.click(screen.getByRole("link", { name: "View 19 Juniper Mews" }));
  expect(
    (
      screen.getByRole("textbox", {
        name: "Private notes for this property",
      }) as HTMLTextAreaElement
    ).value,
  ).toBe("");
  expect(JSON.parse(localStorage.getItem("lechat-note-1")!)).toBe(
    "Only for the first home.",
  );
});

test("neighbourhood hero supports manual navigation, pause and automatic playback", () => {
  vi.useFakeTimers();
  show("/");
  const hero = screen.getByRole("region", {name:"Neighbourhood inspiration"});
  expect(screen.getByRole("link", {name:"Realty Property Search home"})).toBeTruthy();
  expect(screen.queryByText(/Le-Chat/i)).toBeNull();
  fireEvent.click(screen.getByRole("button", {name:"Next neighbourhood scene"}));
  expect(screen.getByRole("heading", {name:"A little closer to the water."})).toBeTruthy();
  fireEvent.keyDown(hero, {key:"ArrowLeft"});
  fireEvent.click(screen.getByRole("button", {name:"Pause neighbourhood slideshow"}));
  act(() => vi.advanceTimersByTime(13000));
  expect(screen.getByRole("heading", {name:"The leafy side of city life."})).toBeTruthy();
  fireEvent.click(screen.getByRole("button", {name:"Play neighbourhood slideshow"}));
  act(() => vi.advanceTimersByTime(6500));
  expect(screen.getByRole("heading", {name:"A little closer to the water."})).toBeTruthy();
});
