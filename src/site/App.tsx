import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  Menu,
  X,
  Search,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Grid2X2,
  Map as MapIcon,
  Check,
  Plus,
  Mail,
  Car,
  Bookmark,
  Share2,
  Sun,
  Moon,
} from "lucide-react";
import {
  properties,
  filterHomes,
  initialFilters,
  money,
  priceLabel,
  mortgagePayment,
  readStored,
  type Property,
  type Filters,
} from "./data";
import { isSearchSite } from "./config";
import NeighbourhoodHero from "./NeighbourhoodHero";
const PropertyMap = lazy(() => import("./PropertyMap"));
const storageKey = "lechat-saved-v2";
const SavedContext = createContext<{
  saved: string[];
  toggle: (id: string) => void;
}>({ saved: [], toggle: () => {} });
const areaNames = [...new Set(properties.map((p) => p.neighbourhood))];
function useSaved() {
  return useContext(SavedContext);
}
function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => readStored(key, fallback));
  const [error, setError] = useState(false);
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      setError(false);
    } catch {
      setError(true);
    }
  }, [key, value]);
  return [value, setValue, error] as const;
}
function ScrollReset() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    document.title = `${isSearchSite ? "Realty Property Search" : "Realty Property Search"} — ${location.pathname.includes("property") ? "Home details" : location.pathname === "/" ? "Toronto & GTA" : location.pathname.split("/").filter(Boolean).join(" ").replaceAll("-", " ")}`;
  }, [location.pathname]);
  return null;
}
function Header() {
  const [theme,setTheme]=useState<"light"|"dark">(()=>{try{return localStorage.getItem("realty-theme")==="light"?"light":"dark"}catch{return "dark"}});
  useEffect(()=>{document.documentElement.dataset.theme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute("content",theme==="dark"?"#181617":"#f8f8f3");try{localStorage.setItem("realty-theme",theme)}catch{}},[theme]);
  const [open, setOpen] = useState(false);
  const { saved } = useSaved();
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <>
      <div className="demo-bar flex justify-between [padding:7px_5%] max-[700px]:[padding:7px_5%] max-[700px]:justify-center max-[700px]:text-center">
        <span>REALTY PROPERTY SEARCH</span>
        <span>
          Concept portfolio · Fictional homes & AI-generated photography
        </span>
      </div>
      <header className="header sticky [top:0] [z-index:1100] flex justify-between items-center [padding:21px_5%] [gap:30px] [min-height:92px] max-[1200px]:[gap:20px] max-[1200px]:[padding-left:4%] max-[1200px]:[padding-right:4%] max-[700px]:[min-height:78px] max-[700px]:[padding:17px_5%] max-[700px]:[gap:15px]">
        <Link to="/" className="wordmark" aria-label="Realty Property Search home">
          <img className="realty-logo-mark" src="/assets/realty-mark.svg" alt="" />
          <span className="realty-logo-type">REALTY<small>PROPERTY SEARCH</small></span>
        </Link>
        <nav aria-label="Main navigation" className={open ? "open" : ""}>
          {(isSearchSite
            ? [
                ["/", "Discover homes"],
                ["/map", "Map search"],
                ["/neighbourhoods", "Neighbourhoods"],
                ["/mortgage-calculator", "Mortgage calculator"],
              ]
            : [
                ["/find-your-home", "Find a home"],
                ["/buy", "Buy"],
                ["/sell", "Sell"],
                ["/about", "About"],
                ["/neighbourhoods", "Neighbourhoods"],
              ]
          ).map(([url, title]) => (
            <NavLink key={url} to={url} end>
              {title}
            </NavLink>
          ))}
          <Link to="/saved" className="saved-nav">
            <Heart size={17} />
            Saved <span>{saved.length}</span>
          </Link>
        </nav>
        <div className="header-actions">
        <Link className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap button-small header-contact" to="/contact">
          Let’s talk <ArrowUpRight size={15} />
        </Link>
        <button className="realty-theme-toggle" aria-label={theme==="dark"?"Switch to light theme":"Switch to dark red theme"} onClick={()=>setTheme(theme==="dark"?"light":"dark")}>{theme==="dark"?<Sun size={18}/>:<Moon size={18}/>}</button>
        <button
          className="icon-button inline-flex items-center justify-center [padding:8px] mobile-menu"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top grid [grid-template-columns:1fr_1.4fr] [gap:60px] [padding-bottom:65px] max-[1200px]:[gap:40px] max-[1200px]:[grid-template-columns:1fr_1.5fr] max-[900px]:[grid-template-columns:1fr] max-[900px]:[gap:15px] max-[700px]:[padding-bottom:35px]">
        <div>
          <p className="eyebrow">A GOOD PLACE TO START</p>
          <h2>
            Let’s find your
            <br />
            <em>kind of home.</em>
          </h2>
          <Link to="/contact" className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap light">
            Start a conversation <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="footer-links grid [grid-template-columns:repeat(3,_1fr)] [gap:30px] [padding-top:25px] max-[1200px]:[gap:20px] max-[900px]:[padding-top:20px] max-[900px]:[gap:40px] max-[700px]:[grid-template-columns:1fr_1fr] max-[700px]:[gap:30px_20px]">
          <div>
            <h3>Explore</h3>
            <Link to="/find-your-home">Homes for sale & lease</Link>
            <Link to="/new-listings">New in the collection</Link>
            <Link to="/neighbourhoods">Neighbourhoods</Link>
            <Link to="/saved">Saved homes</Link>
          </div>
          <div>
            <h3>Your next move</h3>
            <Link to="/buy">Buying a home</Link>
            <Link to="/sell">Selling your home</Link>
            <Link to="/mortgage-calculator">Mortgage calculator</Link>
            <Link to="/about">About Realty Property Search</Link>
          </div>
          <div>
            <h3>Get in touch</h3>
            <p>Portfolio enquiries</p>
            <a href="mailto:johnparker@rogers.com">johnparker@rogers.com</a>
            <p>
              Toronto & the Greater
              <br />
              Toronto Area, Ontario
            </p>
          </div>
        </div>
      </div>
      <div className="footer-bottom flex items-center justify-between [gap:24px] [padding-top:25px] max-[900px]:flex-wrap max-[700px]:[gap:20px] max-[700px]:items-start">
        <Link to="/" className="wordmark">
          REALTY <span>PROPERTY SEARCH</span>
        </Link>
        <p>© {new Date().getFullYear()} Realty Property Search concept website.</p>
        <p>
          54 fictional listings. Images are AI-generated illustrations.
          <br />
          Prices, addresses and map pins are sample data, not MLS listings.
        </p>
      </div>
    </footer>
  );
}
function SaveButton({
  p,
  className = "",
}: {
  p: Property;
  className?: string;
}) {
  const { saved, toggle } = useSaved();
  const active = saved.includes(p.id);
  return (
    <button
      className={`save-button ${className} ${active ? "active" : ""}`}
      aria-label={`${active ? "Unsave" : "Save"} ${p.address}`}
      aria-pressed={active}
      onClick={() => toggle(p.id)}
    >
      <Heart size={19} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
function PropertyCard({ p }: { p: Property }) {
  return (
    <article className="property-card min-w-0">
      <div className="card-photo relative overflow-hidden">
        <Link to={`/property/${p.id}`} aria-label={`View ${p.address}`}>
          <img
            src={p.images[0]}
            alt={`AI-generated exterior concept for ${p.address}`}
            loading="lazy"
            width="960"
            height="640"
          />
        </Link>
        <span className="property-status">{p.status}</span>
        <SaveButton p={p} />
        <span className="card-days">
          {p.daysListed <= 7
            ? "New this week"
            : `${p.daysListed} days in collection`}
        </span>
      </div>
      <div className="card-copy">
        <div className="card-price flex justify-between [gap:12px] items-center">
          <strong>{priceLabel(p)}</strong>
          <span>{p.type}</span>
        </div>
        <Link to={`/property/${p.id}`}>
          <h3>{p.address}</h3>
        </Link>
        <p className="location flex [gap:5px] items-center">
          <MapPin size={13} />
          {p.neighbourhood}, {p.city}
        </p>
        <div className="property-stats flex [gap:16px] flex-wrap [margin-top:18px] [padding-top:15px] max-[700px]:[gap:20px]">
          <span>
            <BedDouble size={16} />
            {p.beds} beds
          </span>
          <span>
            <Bath size={16} />
            {p.baths} baths
          </span>
          <span>
            <Maximize size={15} />
            {p.sqft.toLocaleString()} sq ft
          </span>
        </div>
      </div>
    </article>
  );
}
function SectionHeading({
  eyebrow,
  title,
  link,
  label,
}: {
  eyebrow: string;
  title: string;
  link?: string;
  label?: string;
}) {
  return (
    <div className="section-heading flex justify-between items-end [gap:24px] [margin-bottom:36px] max-[700px]:flex-wrap max-[700px]:[gap:22px] max-[700px]:[margin-bottom:28px]">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {link && (
        <Link to={link} className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]">
          {label ?? "Explore more"} <ArrowUpRight size={17} />
        </Link>
      )}
    </div>
  );
}
function HomeSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("For sale");
  return (
    <form
      className="hero-search flex [max-width:830px] [padding:12px] [margin-top:38px] max-[700px]:grid max-[700px]:[grid-template-columns:1fr_1.8fr] max-[700px]:[padding:10px] max-[700px]:[margin-top:30px]"
      onSubmit={(e) => {
        e.preventDefault();
        navigate(
          `/find-your-home?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}`,
        );
      }}
    >
      <label>
        <span>I’m looking to</span>
        <select
          aria-label="Buy or lease"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="For sale">Buy a home</option>
          <option value="For lease">Lease a home</option>
          <option value="All listings">Explore all homes</option>
        </select>
      </label>
      <label className="search-location">
        <span>In a place like</span>
        <input
          aria-label="Search city or neighbourhood"
          placeholder="City, neighbourhood or home type"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <button className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap" type="submit">
        <Search size={18} />
        Find a home
      </button>
    </form>
  );
}
function Home() {
  return (
    <>
      <section className="hero relative [min-height:720px] overflow-hidden max-[900px]:[min-height:650px] max-[700px]:[min-height:740px]">
        <img
          className="hero-photo"
          src="/images/properties/exterior-02.webp"
          alt="AI-generated contemporary home with warm interior lighting"
          loading="eager"
        />
        <div className="hero-shade" />
        <div className="hero-inner relative [padding:80px_7%_30px] [max-width:1600px] m-auto max-[1200px]:[padding-left:6%] max-[1200px]:[padding-right:6%] max-[900px]:[padding-top:65px] max-[700px]:[padding:60px_6%_25px]">
          <p className="eyebrow">TORONTO & THE GREATER TORONTO AREA</p>
          <h1>
            A place that
            <br />
            feels like <em>you.</em>
          </h1>
          <p>
            Homes with character. Advice with perspective.
            <br />A more thoughtful way to make your next move.
          </p>
          <HomeSearch />
          <div className="hero-footer [margin-top:56px] flex justify-between max-[700px]:[margin-top:35px] max-[700px]:[gap:20px]">
            <span>Good homes. Better beginnings.</span>
            <a href="#collection">
              Discover the collection <span>↓</span>
            </a>
          </div>
        </div>
      </section>
      <div className="intro-strip [padding:42px_7%] grid [grid-template-columns:1.1fr_1.8fr_70px] items-center [gap:70px] max-[1200px]:[gap:35px] max-[1200px]:[padding-left:5%] max-[1200px]:[padding-right:5%] max-[900px]:[grid-template-columns:1fr_1.5fr] max-[900px]:[gap:30px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:17px] max-[700px]:[padding:32px_6%]">
        <p>
          More than an address.
          <br />
          <strong>A better fit for your life.</strong>
        </p>
        <p>
          From your first shortlist to the final walk-through, bring the
          practical questions and the big ideas. We’ll help you see what matters
          and plan the next step.
        </p>
        <Link to="/about" className="round-link [width:50px] [height:50px] grid place-items-center" aria-label="About Realty Property Search">
          <ArrowUpRight />
        </Link>
      </div>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]" id="collection">
        <SectionHeading
          eyebrow="01 / HOMES WORTH A CLOSER LOOK"
          title="The considered collection."
          link="/find-your-home?status=All+listings"
          label="Browse all 54 homes"
        />
        <div className="property-grid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:34px_26px] max-[900px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:30px]">
          {properties
            .filter((p) => p.featured)
            .slice(0, 3)
            .map((p) => (
              <PropertyCard key={p.id} p={p} />
            ))}
        </div>
      </section>
      <section className="editorial-split grid [grid-template-columns:1fr_1fr] max-[700px]:[grid-template-columns:1fr]">
        <div className="editorial-photo [min-height:580px] relative overflow-hidden max-[900px]:[min-height:500px] max-[700px]:[min-height:370px]">
          <img
            src="/images/properties/interior-01.webp"
            alt="AI-generated warm, contemporary living room"
            loading="lazy"
          />
          <span>SPACE FOR YOUR EVERYDAY</span>
        </div>
        <div className="editorial-copy [padding:80px_14%] flex flex-col items-start justify-center max-[1200px]:[padding:60px_10%] max-[900px]:[padding:50px_10%] max-[700px]:[padding:45px_7%]">
          <p className="eyebrow">02 / A HOME, ON YOUR TERMS</p>
          <h2>
            Your life comes first.
            <br />
            <em>The search follows.</em>
          </h2>
          <p>
            A shorter commute. Space to work. A garden, a neighbourhood café, or
            simply a room that catches the morning sun. Start with the details
            that make a place feel right.
          </p>
          <p>
            We pair that wish list with a clear budget, a practical search plan
            and time to ask the questions that don’t fit on a listing card.
          </p>
          <Link to="/buy" className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap">
            A guide to buying <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <SectionHeading
          eyebrow="03 / KNOW THE PLACE"
          title="Find your neighbourhood rhythm."
          link="/neighbourhoods"
          label="Explore the neighbourhoods"
        />
        <div className="area-grid grid [grid-template-columns:repeat(3,_1fr)] [gap:25px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:18px]">
          {areaNames.slice(0, 3).map((name, i) => (
            <Link
              className="area-card relative [height:340px] overflow-hidden max-[900px]:[height:270px] max-[700px]:[height:280px]"
              key={name}
              to={`/find-your-home?q=${encodeURIComponent(name)}&status=All+listings`}
            >
              <img
                src={properties[i * 6].images[0]}
                alt={`AI-generated home inspired by ${name}`}
                loading="lazy"
              />
              <span>
                <small>TORONTO</small>
                <strong>{name}</strong>
                <ArrowUpRight />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="service-section section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <SectionHeading
          eyebrow="04 / THE NEXT CHAPTER"
          title="Make your move with a plan."
        />
        <div className="service-grid grid [grid-template-columns:repeat(3,_1fr)] [gap:35px] max-[900px]:[gap:25px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:10px]">
          {[
            [
              "01",
              "Buying, with clarity.",
              "Turn a long wish list into a focused search. Understand the trade-offs, compare your options and know what to ask before an offer.",
              "/buy",
            ],
            [
              "02",
              "Selling, with intention.",
              "Start with thoughtful preparation, a considered presentation and a plan for showing your home at its best.",
              "/sell",
            ],
            [
              "03",
              "Know your numbers.",
              "Explore how price, down payment and financing assumptions affect an estimated monthly payment.",
              "/mortgage-calculator",
            ],
          ].map(([num, title, body, url]) => (
            <Link to={url} className="service-card" key={num}>
              <span>
                {num}
                <ArrowUpRight />
              </span>
              <h3>{title}</h3>
              <p>{body}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
function parseFilters(params: URLSearchParams, saved = false): Filters {
  return {
    ...initialFilters,
    query: params.get("q") ?? "",
    type: params.get("type") ?? "All types",
    status: params.get("status") ?? (saved ? "All listings" : "For sale"),
    minBeds: Math.max(0, Number(params.get("beds")) || 0),
    minPrice: Math.max(0, Number(params.get("min")) || 0),
    maxPrice: Math.max(0, Number(params.get("max")) || 0),
    savedOnly: saved,
  };
}
function Listings({
  savedOnly = false,
  newOnly = false,
  mapDefault = false,
}: {
  savedOnly?: boolean;
  newOnly?: boolean;
  mapDefault?: boolean;
}) {
  const [params, setParams] = useSearchParams();
  const routePath = useLocation().pathname;
  const { saved } = useSaved();
  const [view, setView] = useState<"grid" | "map">(mapDefault ? "map" : "grid");
  const [more, setMore] = useState(false);
  const [visible, setVisible] = useState(12);
  const f = parseFilters(params, savedOnly);
  const sort = params.get("sort") ?? (newOnly ? "newest" : "featured");
  const [mapBounds, setMapBounds] = useState<{
    south: number;
    north: number;
    west: number;
    east: number;
  } | null>(null);
  const [inMap, setInMap] = useState(false);
  useEffect(() => {
    setView(mapDefault ? "map" : "grid");
    setVisible(12);
    setInMap(false);
  }, [mapDefault, routePath]);
  function update(key: string, value: string) {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    setParams(next, { replace: true });
    setVisible(12);
  }
  const matches = useMemo(() => {
    let rows = filterHomes(properties, f, saved);
    if (newOnly) rows = rows.filter((p) => p.daysListed <= 7);
    if (view === "map" && inMap && mapBounds)
      rows = rows.filter(
        (p) =>
          p.coords.lat >= mapBounds.south &&
          p.coords.lat <= mapBounds.north &&
          p.coords.lng >= mapBounds.west &&
          p.coords.lng <= mapBounds.east,
      );
    return [...rows].sort((a, b) =>
      sort === "price-low"
        ? a.price - b.price
        : sort === "price-high"
          ? b.price - a.price
          : sort === "newest"
            ? a.daysListed - b.daysListed
            : Number(b.featured) - Number(a.featured),
    );
  }, [params.toString(), saved, newOnly, view, inMap, mapBounds]);
  const Heading = routePath === "/" ? "h2" : "h1";
  const title = savedOnly
    ? "A shortlist that feels like you."
    : newOnly
      ? "A fresh perspective on home."
      : isSearchSite
        ? "Your next chapter, mapped."
        : "Find a place to make your own.";
  return (
    <>
      <section className={`search-intro [padding:60px_5%_46px] flex justify-between items-center max-[700px]:[padding:40px_6%_32px] ${isSearchSite ? "search-brand" : ""}`}>
        <div>
          <p className="eyebrow">
            {savedOnly
              ? "YOUR PERSONAL COLLECTION"
              : newOnly
                ? "NEW THIS WEEK"
                : "TORONTO & GREATER TORONTO AREA"}
          </p>
          <Heading>{title}</Heading>
          <p>
            {savedOnly
              ? "Keep the homes you want to revisit. Your shortlist stays on this browser."
              : newOnly
                ? "A closer look at the sample homes added to the collection in the last seven days."
                : "A considered collection of homes, with room to search your way."}
          </p>
        </div>
        <span className="collection-seal">
          54
          <br />
          <small>
            HOMES TO
            <br />
            EXPLORE
          </small>
        </span>
      </section>
      <section id="homes" className="listing-section [padding:28px_5%_70px] max-[700px]:[padding:22px_5%_55px]">
        <div className="filter-bar flex [gap:12px] [padding-bottom:23px] max-[1200px]:[gap:8px] max-[900px]:flex-wrap max-[700px]:[gap:8px] max-[700px]:[padding-bottom:20px]">
          <div className="search-input flex items-center [flex:1] [padding:0_14px] [gap:7px] max-[900px]:[min-height:50px] max-[700px]:[height:48px]">
            <Search size={18} />
            <input
              aria-label="Search properties"
              placeholder="City, neighbourhood, address…"
              value={f.query}
              onChange={(e) => update("q", e.target.value)}
            />
            {f.query && (
              <button
                aria-label="Clear search"
                className="icon-button inline-flex items-center justify-center [padding:8px]"
                onClick={() => update("q", "")}
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            aria-label="Listing status"
            value={f.status}
            onChange={(e) => update("status", e.target.value)}
          >
            <option>All listings</option>
            <option>For sale</option>
            <option>For lease</option>
          </select>
          <select
            aria-label="Property type"
            value={f.type}
            onChange={(e) => update("type", e.target.value)}
          >
            <option>All types</option>
            {["Detached", "Semi-detached", "Townhouse", "Condo", "Loft"].map(
              (x) => (
                <option key={x}>{x}</option>
              ),
            )}
          </select>
          <select
            aria-label="Minimum bedrooms"
            value={f.minBeds}
            onChange={(e) => update("beds", e.target.value)}
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option value={n} key={n}>
                {n ? n + "+ beds" : "Any beds"}
              </option>
            ))}
          </select>
          <button
            className={`button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap outline filter-toggle ${more ? "selected" : ""}`}
            aria-expanded={more}
            onClick={() => setMore(!more)}
          >
            <SlidersHorizontal size={16} />
            Filters
            {(f.minPrice || f.maxPrice) > 0 && <span className="filter-dot" />}
          </button>
        </div>
        {more && (
          <div className="extra-filters flex items-end [gap:20px] [padding:24px] max-[900px]:flex-wrap max-[700px]:[padding:20px] max-[700px]:[gap:15px]">
            <label>
              Minimum price
              <input
                aria-label="Minimum price"
                type="number"
                min="0"
                step="50000"
                value={f.minPrice || ""}
                placeholder="No minimum"
                onChange={(e) => update("min", e.target.value)}
              />
            </label>
            <label>
              Maximum price
              <input
                aria-label="Maximum price"
                type="number"
                min="0"
                step="50000"
                value={f.maxPrice || ""}
                placeholder="No maximum"
                onChange={(e) => update("max", e.target.value)}
              />
            </label>
            <p>Prices are in CAD. Lease prices are monthly.</p>
            <button
              className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]"
              onClick={() => {
                setParams({ status: "All listings" });
                setInMap(false);
                setVisible(12);
              }}
            >
              Reset filters <X size={14} />
            </button>
          </div>
        )}
        <div className="results-toolbar flex justify-between items-center [gap:24px] [padding:25px_0] max-[700px]:[gap:15px] max-[700px]:flex-wrap max-[700px]:[padding:22px_0]">
          <p role="status">
            <strong>{matches.length}</strong>{" "}
            {matches.length === 1 ? "home" : "homes"}{" "}
            {savedOnly ? "saved" : "in your collection"}
            <span> · Sample listings</span>
          </p>
          <div className="flex-wrap">
            <label className="sort-label whitespace-nowrap">
              Sort by{" "}
              <select
                aria-label="Sort properties"
                value={sort}
                onChange={(e) => update("sort", e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
            <div className="view-switch" aria-label="Listing view">
              <button
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <Grid2X2 size={16} />
                Grid
              </button>
              <button
                aria-pressed={view === "map"}
                onClick={() => setView("map")}
              >
                <MapIcon size={16} />
                Map
              </button>
            </div>
          </div>
        </div>
        {view === "map" && (
          <div className="map-toolbar flex items-center justify-between [margin-bottom:17px] [gap:20px] max-[700px]:flex-col max-[700px]:items-start max-[700px]:[gap:8px] max-[700px]:[margin:0_0_17px]">
            <label>
              <input
                type="checkbox"
                checked={inMap}
                onChange={(e) => setInMap(e.target.checked)}
              />
              Show homes in this map area
            </label>
            <p>
              Map pins show approximate neighbourhood locations for fictional
              homes.
            </p>
          </div>
        )}
        <div className={view === "map" ? "map-results grid [grid-template-columns:minmax(0,_1fr)_minmax(0,_1fr)] [gap:28px] items-start max-[1200px]:[grid-template-columns:1.1fr_1fr] max-[1200px]:[gap:20px] max-[700px]:flex max-[700px]:[flex-direction:column-reverse] max-[700px]:[gap:25px]" : "grid-results"}>
          <div>
            {matches.length ? (
              <>
                <div className="property-grid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:34px_26px] max-[900px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:30px]">
                  {matches.slice(0, visible).map((p) => (
                    <PropertyCard p={p} key={p.id} />
                  ))}
                </div>
                {visible < matches.length && (
                  <div className="load-more flex flex-col items-center [gap:17px] [padding-top:45px] max-[700px]:[padding-top:35px]">
                    <button
                      className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap outline"
                      onClick={() => setVisible((v) => v + 12)}
                    >
                      Show more homes <Plus size={17} />
                    </button>
                    <span>
                      Showing {Math.min(visible, matches.length)} of{" "}
                      {matches.length}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state text-center [padding:100px_20px] flex flex-col items-center [gap:20px] max-[700px]:[padding:65px_20px]">
                <Bookmark size={36} />
                <h2>
                  {savedOnly
                    ? "Your shortlist starts here."
                    : "No homes match these filters."}
                </h2>
                <p>
                  {savedOnly
                    ? "Tap the heart on any home to keep it in your collection."
                    : "Try a different neighbourhood, price range or home type."}
                </p>
                {savedOnly ? (
                  <Link className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap" to="/find-your-home">
                    Explore the collection <ArrowRight size={17} />
                  </Link>
                ) : (
                  <button
                    className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap"
                    onClick={() => {
                      setParams({ status: "All listings" });
                      setInMap(false);
                    }}
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
          {view === "map" && (
            <aside className="map-column sticky [top:120px] [height:calc(100dvh_-_155px)] [min-height:450px] [z-index:0] max-[700px]:relative max-[700px]:[top:auto] max-[700px]:w-full max-[700px]:[height:400px] max-[700px]:[min-height:400px]" aria-label="Property map">
              <Suspense fallback={<p className="map-loading">Loading map…</p>}>
                <PropertyMap
                  properties={filterHomes(properties, f, saved)}
                  onBoundsChange={setMapBounds}
                />
              </Suspense>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
function Gallery({ p }: { p: Property }) {
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const open = (i: number) => {
    setIndex(i);
    dialog.current?.showModal();
  };
  useEffect(() => {
    const node = dialog.current;
    const close = () => document.body.style.removeProperty("overflow");
    node?.addEventListener("close", close);
    return () => {
      node?.removeEventListener("close", close);
      close();
    };
  }, []);
  return (
    <>
      <div className="gallery-grid grid [grid-template-columns:1.65fr_1fr] [grid-template-rows:230px_230px] [gap:10px] max-[900px]:[grid-template-rows:180px_180px] max-[700px]:[grid-template-columns:1fr_1fr] max-[700px]:[grid-template-rows:270px_120px] max-[700px]:[gap:7px]">
        {p.images.slice(0, 3).map((src, i) => (
          <button
            key={src}
            onClick={() => {
              document.body.style.overflow = "hidden";
              open(i);
            }}
            aria-label={`Open ${p.imageLabels[i]} photo`}
          >
            <img
              src={src}
              alt={`AI-generated ${p.imageLabels[i].toLowerCase()} concept for ${p.address}`}
              loading={i ? "lazy" : "eager"}
            />
            {i === 2 && (
              <span>
                <Grid2X2 size={16} />
                View all 4 photos
              </span>
            )}
          </button>
        ))}
      </div>
      <dialog
        className="gallery-dialog"
        ref={dialog}
        aria-label={`Photo gallery for ${p.address}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            setIndex((v) => (v + 1) % p.images.length);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            setIndex((v) => (v + p.images.length - 1) % p.images.length);
          }
        }}
      >
        <button
          className="gallery-close icon-button inline-flex items-center justify-center [padding:8px]"
          aria-label="Close gallery"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <img
          src={p.images[index]}
          alt={`AI-generated ${p.imageLabels[index].toLowerCase()} concept for ${p.address}`}
        />
        <div className="gallery-controls">
          <button
            className="icon-button inline-flex items-center justify-center [padding:8px]"
            aria-label="Previous photo"
            onClick={() =>
              setIndex((v) => (v + p.images.length - 1) % p.images.length)
            }
          >
            <ChevronLeft />
          </button>
          <p>
            {p.imageLabels[index]}{" "}
            <span>
              {index + 1} / {p.images.length}
            </span>
            <small>AI-generated illustrative photography</small>
          </p>
          <button
            className="icon-button inline-flex items-center justify-center [padding:8px]"
            aria-label="Next photo"
            onClick={() => setIndex((v) => (v + 1) % p.images.length)}
          >
            <ChevronRight />
          </button>
        </div>
      </dialog>
    </>
  );
}
function PropertyRoute() {
  const { id } = useParams();
  return <PropertyDetail key={id} />;
}
function PropertyDetail() {
  const { id } = useParams();
  const p = properties.find((p) => p.id === id || p.slug === id);
  const [copied, setCopied] = useState(false);
  const [note, setNote, noteError] = usePersisted(`lechat-note-${id}`, "");
  if (!p) return <NotFound />;
  const related = properties
    .filter((x) => x.id !== p.id && x.type === p.type)
    .slice(0, 3);
  return (
    <>
      <section className="property-page">
        <div className="property-breadcrumb">
          <Link to="/find-your-home">
            <ChevronLeft size={15} />
            Back to the collection
          </Link>
          <div>
            <button
              className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Share2 size={15} />
              {copied ? "Link copied" : "Copy link"}
            </button>
            <SaveButton p={p} className="inline-save" />
          </div>
        </div>
        <div className="property-title flex justify-between items-end [gap:30px] [margin:30px_0] max-[700px]:flex-col max-[700px]:items-start max-[700px]:[gap:20px] max-[700px]:[margin:28px_0]">
          <div>
            <p className="eyebrow">
              {p.neighbourhood.toUpperCase()} / {p.type.toUpperCase()}
            </p>
            <h1>{p.address}</h1>
            <p>
              <MapPin size={16} />
              {p.neighbourhood}, {p.city}, Ontario
            </p>
          </div>
          <div>
            <span className="property-status dark">{p.status}</span>
            <strong>{priceLabel(p)}</strong>
            <small>Fictional property · Sample price</small>
          </div>
        </div>
        <Gallery p={p} />
        <div className="detail-layout grid [grid-template-columns:minmax(0,_1.8fr)_minmax(260px,_1fr)] [gap:70px] [padding:0_0_60px] items-start max-[1200px]:[gap:35px] max-[900px]:[grid-template-columns:1.5fr_1fr] max-[900px]:[gap:25px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:0] max-[700px]:[padding-bottom:25px]">
          <article>
            <div className="detail-stats grid [grid-template-columns:repeat(4,_1fr)] [padding:35px_0] [gap:20px] max-[900px]:[gap:10px] max-[700px]:[gap:10px] max-[700px]:[padding:27px_0]">
              <span>
                <BedDouble />
                {p.beds}
                <small>Bedrooms</small>
              </span>
              <span>
                <Bath />
                {p.baths}
                <small>Bathrooms</small>
              </span>
              <span>
                <Maximize />
                {p.sqft.toLocaleString()}
                <small>Square feet</small>
              </span>
              <span>
                <Car />
                {p.parking}
                <small>Parking spaces</small>
              </span>
            </div>
            <section className="detail-section">
              <p className="eyebrow">A CLOSER LOOK</p>
              <h2>{p.headline}</h2>
              <p>{p.description}</p>
              <p>
                The layout creates a clear separation between shared living
                areas and private rooms. Use the gallery to explore the design
                direction, then note what you would want to see in person:
                natural light, storage, room proportions and how the home
                connects to the street.
              </p>
              <div className="highlights grid [grid-template-columns:repeat(2,_1fr)] [gap:17px] [margin-top:28px] max-[900px]:[grid-template-columns:1fr] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:15px]">
                {p.highlights.map((x) => (
                  <span key={x}>
                    <Check size={16} />
                    {x}
                  </span>
                ))}
              </div>
            </section>
            <section className="detail-section">
              <h2>The details, at a glance.</h2>
              <dl className="details-table">
                {[
                  ["Home type", p.type],
                  ["Neighbourhood", p.neighbourhood],
                  ["Interior size", `${p.sqft.toLocaleString()} sq ft`],
                  ["Parking", String(p.parking)],
                  ["Status", p.status],
                  [
                    "Sample monthly maintenance",
                    p.fees ? money(p.fees) : "Not applicable",
                  ],
                  [
                    "Sample annual property tax",
                    p.taxes ? money(p.taxes) : "Not provided for lease",
                  ],
                  ["Added to collection", `${p.daysListed} days ago`],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="detail-section">
              <h2>Space to picture your life.</h2>
              <p>
                Illustrative room sizes, provided to make comparing these
                concept homes easier.
              </p>
              <dl className="details-table">
                {p.rooms.map((r) => (
                  <div key={r.name}>
                    <dt>{r.name}</dt>
                    <dd>{r.dimensions}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <section className="detail-section">
              <h2>Your private viewing notes.</h2>
              <p>
                Keep questions and first impressions beside this home. Notes are
                saved only on this browser.
              </p>
              <label className="sr-only" htmlFor="property-note">
                Private notes for this property
              </label>
              <textarea
                id="property-note"
                rows={5}
                maxLength={4000}
                placeholder="What feels right? What would you ask at a viewing?"
                value={typeof note === "string" ? note : ""}
                onChange={(e) => setNote(e.target.value)}
              />
              <small role="status">
                {noteError
                  ? "Browser storage is unavailable. Notes will last only for this visit."
                  : "Saved on this browser."}
              </small>
            </section>
            <p className="listing-disclosure">
              This is a fictional demonstration listing. Its address,
              dimensions, price and amenities are sample data. The AI-generated
              images illustrate a design concept and do not depict a home
              offered for sale or lease. Map pins indicate an approximate
              neighbourhood, not a verified property location.
            </p>
          </article>
          <aside className="viewing-card">
            <p className="eyebrow">YOUR NEXT STEP</p>
            <h2>
              See the possibilities.
              <br />
              <em>Ask the right questions.</em>
            </h2>
            <p>
              Tell us what caught your eye, what you’re looking for and when
              you hope to move.
            </p>
            <Link
              className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap"
              to={`/contact?property=${encodeURIComponent(p.address)}`}
            >
              Ask about a home <ArrowUpRight size={16} />
            </Link>

            <a className="contact-line" href="mailto:johnparker@rogers.com">
              <Mail size={16} />
              johnparker@rogers.com
            </a>
            <hr />
            <p className="eyebrow">PLANNING AHEAD</p>
            <Link
              className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]"
              to={`/mortgage-calculator?price=${p.status === "For sale" ? p.price : 1000000}`}
            >
              Explore monthly payments <ArrowUpRight size={16} />
            </Link>
            <small>
              Use your own financing assumptions to compare scenarios.
            </small>
          </aside>
        </div>
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <SectionHeading
          eyebrow="KEEP EXPLORING"
          title="A few more possibilities."
        />
        <div className="property-grid grid [grid-template-columns:repeat(3,_minmax(0,_1fr))] [gap:34px_26px] max-[900px]:[grid-template-columns:repeat(2,_minmax(0,_1fr))] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:30px]">
          {related.map((p) => (
            <PropertyCard key={p.id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
const buyerSteps = [
  [
    "Start with your everyday.",
    "Write down how you live now and what needs to change. Separate essentials from preferences: bedrooms, outdoor space, commute, accessibility and the streets you want to spend time on.",
  ],
  [
    "Set a practical budget.",
    "Speak with your lender about financing, then set a purchase range that leaves room for closing costs, moving and the work a home may need. A pre-approval is a starting point for a conversation.",
  ],
  [
    "Build a focused shortlist.",
    "Compare homes against the same criteria. Look beyond the photos to room proportions, storage, building condition and the neighbourhood at different times of day.",
  ],
  [
    "Understand the offer.",
    "Review price, deposit, closing date and any conditions with your agent and lawyer. Ask what each term means for your circumstances before signing.",
  ],
  [
    "Work through the details.",
    "Complete agreed inspections, document reviews and financing steps within the dates set out in the agreement. Keep questions and decisions in writing.",
  ],
  [
    "Prepare for a good handover.",
    "Arrange insurance, utilities and your move. Use the final visit to confirm the agreed condition and follow your lawyer’s instructions for closing.",
  ],
];
const sellerSteps = [
  [
    "Get clear on the move.",
    "Discuss why you’re selling, your preferred timeline and what comes next. A useful plan accounts for both the sale and the practical work of leaving a home.",
  ],
  [
    "Understand the competition.",
    "Review comparable properties with your agent and consider condition, location and current alternatives. Set a positioning strategy with room to respond to new information.",
  ],
  [
    "Prepare with purpose.",
    "Address visible maintenance, simplify rooms and decide where repairs or staging will help. The goal is a clear, honest presentation of the home’s strengths.",
  ],
  [
    "Present the home thoughtfully.",
    "Plan photography, listing copy and showings around the details that matter. Room sizes, features and inclusions should be checked before publication.",
  ],
  [
    "Review offers carefully.",
    "Compare the full terms, including conditions, deposit and closing date. A strong number is only one part of an agreement that works for your plans.",
  ],
  [
    "Keep the closing organized.",
    "Track agreed work, documents, move-out arrangements and final dates. Your agent and lawyer can help resolve outstanding questions before the keys change hands.",
  ],
];
function Guide({ kind }: { kind: "buy" | "sell" }) {
  const buy = kind === "buy";
  const steps = buy ? buyerSteps : sellerSteps;
  const faqs = buy
    ? [
        [
          "Where should I start?",
          "Start with your priorities and a financing conversation. Knowing your comfortable range makes the search more useful and helps you compare homes on the same basis.",
        ],
        [
          "What should I look for during a viewing?",
          "Notice light, noise, storage and the condition of finishes and systems. Ask about age, maintenance and documentation. A home inspection or specialist review may help answer questions that a viewing cannot.",
        ],
        [
          "Can I compare several neighbourhoods?",
          "Yes. Use the map search to explore the nine neighbourhood areas in this sample collection, save a shortlist and keep private notes beside each home.",
        ],
      ]
    : [
        [
          "Do I need to renovate before listing?",
          "Not every home needs a renovation. Review maintenance, presentation and likely buyer expectations with your agent before choosing work. Focus on the changes that fit your timeline and budget.",
        ],
        [
          "How is a listing price chosen?",
          "An agent can help review comparable properties, the home’s condition and the options buyers can currently choose. The sample prices on this site are fictional and are not market valuations.",
        ],
        [
          "What happens after an offer is accepted?",
          "The next steps depend on the agreement. Keep track of conditions and dates, work with your lawyer and agent, and confirm the arrangements for moving and handing over the property.",
        ],
      ];
  return (
    <>
      <section className="guide-hero grid [grid-template-columns:1fr_1fr] [min-height:580px] max-[900px]:[min-height:520px] max-[700px]:[grid-template-columns:1fr]">
        <div>
          <p className="eyebrow">
            {buy ? "BUY WITH PERSPECTIVE" : "SELL WITH A PLAN"}
          </p>
          <h1>
            {buy ? (
              <>
                The next chapter.
                <br />
                <em>On your terms.</em>
              </>
            ) : (
              <>
                A considered sale.
                <br />
                <em>A confident next step.</em>
              </>
            )}
          </h1>
          <p>
            {buy
              ? "A home is a big decision made up of smaller ones. Give each the time, context and attention it deserves."
              : "Good preparation gives your home a clear story. A thoughtful plan keeps the process grounded from the first conversation to closing."}
          </p>
          <Link to="/contact" className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap">
            Talk through your plans <ArrowUpRight size={17} />
          </Link>
        </div>
        <img
          src={`/images/properties/${buy ? "interior-07" : "exterior-07"}.webp`}
          alt={`AI-generated ${buy ? "kitchen interior" : "home exterior"} concept`}
        />
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <SectionHeading
          eyebrow="THE PROCESS"
          title={
            buy
              ? "A clear path to your next home."
              : "From preparation to the handover."
          }
        />
        <div className="steps-grid grid [grid-template-columns:repeat(3,_1fr)] [gap:40px_45px] max-[900px]:[grid-template-columns:repeat(2,_1fr)] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:8px]">
          {steps.map(([title, body], i) => (
            <article key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="checklist-section section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <div>
          <p className="eyebrow">BRING THESE TO THE CONVERSATION</p>
          <h2>
            {buy
              ? "A wish list with priorities."
              : "A little preparation goes a long way."}
          </h2>
          <p>
            {buy
              ? "The more specific you can be about the life you want at home, the easier it is to recognize a good fit."
              : "Start with the information you already have. Missing documents can be identified early and gathered as the plan takes shape."}
          </p>
        </div>
        <ul>
          {(buy
            ? [
                "Your comfortable monthly budget",
                "Your preferred move date",
                "Must-haves and nice-to-haves",
                "A shortlist of neighbourhoods",
                "Questions for your lender and lawyer",
              ]
            : [
                "Your preferred sale and move dates",
                "Recent improvements and maintenance",
                "Available warranties and permits",
                "Your list of inclusions and exclusions",
                "Questions about showings and preparation",
              ]
          ).map((x) => (
            <li key={x}>
              <Check size={18} />
              {x}
            </li>
          ))}
        </ul>
      </section>
      <Faq items={faqs} />
    </>
  );
}
function Faq({ items }: { items: string[][] }) {
  return (
    <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%] faq-section grid [grid-template-columns:1fr_1.4fr] [gap:90px] max-[900px]:[gap:50px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:25px]">
      <div>
        <p className="eyebrow">A FEW COMMON QUESTIONS</p>
        <h2>
          Before you
          <br />
          <em>make your move.</em>
        </h2>
      </div>
      <div>
        {items.map(([q, a]) => (
          <details key={q}>
            <summary>
              {q}
              <Plus size={18} />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
function About() {
  return (
    <>
      <section className="about-hero grid [grid-template-columns:1.3fr_0.8fr] [padding:70px_10%] [gap:100px] items-center max-[1200px]:[padding:65px_7%] max-[1200px]:[gap:60px] max-[900px]:[gap:40px] max-[900px]:[padding-left:5%] max-[900px]:[padding-right:5%] max-[700px]:[grid-template-columns:1fr] max-[700px]:[padding:45px_7%] max-[700px]:[gap:45px]">
        <div>
          <p className="eyebrow">THE PERSON BEHIND THE PROCESS</p>
          <h1>
            Good advice starts
            <br />
            with <em>listening.</em>
          </h1>
          <p className="lead">
            Your plans deserve more than a quick showing and a long list of
            links. They deserve a conversation.
          </p>
          <p>
            At Realty Property Search, the starting point is your everyday life: where you want
            to be, what you need from a home and what you’re ready to change.
            This independent portfolio experience helps you compare those priorities at your own pace.
          </p>
          <p>
            Bring the questions, the timing and the wish list. A focused search
            or a considered selling plan starts by getting those details clear.
          </p>
          <Link to="/contact" className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap">
            Discuss your search <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="agent-portrait">
          <img
            src="/images/neighbourhoods/village.webp"
            alt="AI-generated leafy neighbourhood inspiration for Realty Property Search"
          />
          <div>
            <strong>Realty Property Search</strong>
            <span>REALTY PROPERTY SEARCH</span>
          </div>
        </div>
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%] values-section">
        <SectionHeading
          eyebrow="WHAT GUIDES THE WORK"
          title="Clear thinking. Personal attention."
        />
        <div className="service-grid grid [grid-template-columns:repeat(3,_1fr)] [gap:35px] max-[900px]:[gap:25px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:10px]">
          {[
            [
              "Listen before looking.",
              "Your home search should reflect your priorities. We start by understanding what the next place needs to make possible.",
            ],
            [
              "Make room for questions.",
              "Big decisions deserve plain answers. We’ll work through the details and flag questions that need a lender, lawyer or specialist.",
            ],
            [
              "Keep the next step clear.",
              "A move has plenty of moving parts. A shared plan helps keep decisions, documents and deadlines in view.",
            ],
          ].map(([title, body], i) => (
            <article className="service-card" key={title}>
              <span>0{i + 1}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="editorial-split grid [grid-template-columns:1fr_1fr] max-[700px]:[grid-template-columns:1fr]">
        <div className="editorial-photo [min-height:580px] relative overflow-hidden max-[900px]:[min-height:500px] max-[700px]:[min-height:370px]">
          <img
            src="/images/properties/interior-03.webp"
            alt="AI-generated townhouse living space"
            loading="lazy"
          />
        </div>
        <div className="editorial-copy [padding:80px_14%] flex flex-col items-start justify-center max-[1200px]:[padding:60px_10%] max-[900px]:[padding:50px_10%] max-[700px]:[padding:45px_7%]">
          <p className="eyebrow">A PLACE IN THE CITY</p>
          <h2>
            Know the home.
            <br />
            <em>Get to know the place.</em>
          </h2>
          <p>
            The details around a home matter too: your route to work, where you
            get groceries, the park you’ll walk through and the streets you’ll
            return to each day.
          </p>
          <p>
            Explore the neighbourhood collection to start comparing those daily
            rhythms. Then use your shortlist to shape a more useful
            conversation.
          </p>
          <Link to="/neighbourhoods" className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]">
            Explore neighbourhoods <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <Faq
        items={[
          [
            "Where does Realty Property Search focus?",
            "This concept collection explores Toronto and the Greater Toronto Area, including selected neighbourhoods in Mississauga, Markham and Vaughan. Explore the sample homes and compare the areas relevant to your plans.",
          ],
          [
            "How can I get started?",
            "Send a brief note with your buying or selling plans, preferred timing and the questions you want to cover. The contact page prepares an email you can review and send yourself.",
          ],
          [
            "Are the listings on this site available?",
            "This is a portfolio demonstration. All 54 properties, prices and addresses are fictional, and the home photography is AI-generated. Use the tools to explore the experience, then speak with a professional about actual properties.",
          ],
        ]}
      />
    </>
  );
}
function Neighbourhoods() {
  return (
    <>
      <section className="page-heading [padding:75px_7%_50px] max-[700px]:[padding:45px_6%_35px]">
        <p className="eyebrow">FIND YOUR EVERYDAY</p>
        <h1>
          Different streets.
          <br />
          <em>Your kind of rhythm.</em>
        </h1>
        <p>
          A neighbourhood is more than a map pin. Start with the places you want
          to spend time, then see which homes fit around them.
        </p>
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%] neighbourhood-section">
        <div className="neighbourhood-grid grid [grid-template-columns:repeat(3,_1fr)] [gap:50px_30px] max-[900px]:[grid-template-columns:repeat(2,_1fr)] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:45px]">
          {areaNames.map((area, i) => {
            const rows = properties.filter((p) => p.neighbourhood === area);
            return (
              <article key={area}>
                <Link
                  to={`/find-your-home?q=${encodeURIComponent(area)}&status=All+listings`}
                  className="neighbourhood-image"
                >
                  <img
                    src={properties[i * 6].images[0]}
                    alt={`AI-generated residential concept inspired by ${area}`}
                    loading="lazy"
                  />
                  <span>
                    {rows.length} sample homes <ArrowUpRight size={17} />
                  </span>
                </Link>
                <p className="eyebrow">{rows[0].city}</p>
                <h2>{area}</h2>
                <p>{rows[0].description.split(". ").slice(-1)[0]}</p>
                <Link
                  className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]"
                  to={`/find-your-home?q=${encodeURIComponent(area)}&status=All+listings`}
                >
                  Explore this area <ArrowRight size={16} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="checklist-section section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <div>
          <p className="eyebrow">WALK THE NEIGHBOURHOOD</p>
          <h2>
            The small details
            <br />
            <em>make a difference.</em>
          </h2>
          <p>
            Use an online search to build a shortlist, then spend time in the
            neighbourhood yourself. Your daily routine is the best frame of
            reference.
          </p>
        </div>
        <ul>
          {[
            "Try the journey you would make on a normal weekday.",
            "Visit at different times and listen to the surroundings.",
            "Find the shops, parks and services you use most.",
            "Check the building, street and accessibility details in person.",
          ].map((x) => (
            <li key={x}>
              <Check size={18} />
              {x}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
function Mortgage() {
  const [params] = useSearchParams();
  const initialPrice = Number(params.get("price"));
  const [price, setPrice] = useState(
    initialPrice >= 100000 && initialPrice <= 8000000 ? initialPrice : 1000000,
  );
  const [down, setDown] = useState(20);
  const [rate, setRate] = useState(4.5);
  const [years, setYears] = useState(25);
  const [tax, setTax] = useState(450);
  const [fees, setFees] = useState(0);
  const [frequency, setFrequency] = useState<"monthly" | "biweekly">("monthly");
  const principal = price * (1 - down / 100);
  const monthly = mortgagePayment(principal, rate, years);
  const amount = frequency === "monthly" ? monthly : (monthly * 12) / 26;
  return (
    <>
      <section className="page-heading [padding:75px_7%_50px] max-[700px]:[padding:45px_6%_35px]">
        <p className="eyebrow">KNOW YOUR NUMBERS</p>
        <h1>
          A little clarity.
          <br />
          <em>Before the big decision.</em>
        </h1>
        <p>
          Change the assumptions to see how they affect an estimated mortgage
          payment. Start a conversation with your lender using numbers you
          understand.
        </p>
      </section>
      <section className="calculator-section grid [grid-template-columns:1.1fr_1fr] [gap:100px] [padding-top:55px] max-[1200px]:[gap:50px] max-[900px]:[gap:35px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:35px] section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <div className="calculator-inputs">
          <h2>Build your scenario.</h2>
          <label>
            Home price <span>CAD</span>
            <input
              aria-label="Home price"
              type="number"
              min="100000"
              max="8000000"
              step="25000"
              value={price}
              onChange={(e) =>
                setPrice(Math.max(0, Math.min(8000000, Number(e.target.value))))
              }
            />
          </label>
          <label>
            Down payment{" "}
            <span>
              {money((price * down) / 100)} · {down}%
            </span>
            <input
              aria-label="Down payment percentage"
              type="range"
              min="20"
              max="90"
              step="1"
              value={down}
              onChange={(e) => setDown(Number(e.target.value))}
            />
          </label>
          <div className="form-row grid [grid-template-columns:1fr_1fr] [gap:20px] max-[900px]:[gap:14px] max-[700px]:[gap:15px]">
            <label>
              Annual interest rate (%)
              <input
                aria-label="Annual interest rate"
                type="number"
                min="0"
                max="20"
                step="0.05"
                value={rate}
                onChange={(e) =>
                  setRate(Math.max(0, Math.min(20, Number(e.target.value))))
                }
              />
            </label>
            <label>
              Amortization
              <select
                aria-label="Amortization"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              >
                {[5, 10, 15, 20, 25, 30].map((n) => (
                  <option key={n} value={n}>
                    {n} years
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row grid [grid-template-columns:1fr_1fr] [gap:20px] max-[900px]:[gap:14px] max-[700px]:[gap:15px]">
            <label>
              Monthly property tax (CAD)
              <input
                aria-label="Monthly property tax"
                type="number"
                min="0"
                max="10000"
                value={tax}
                onChange={(e) =>
                  setTax(Math.max(0, Math.min(10000, Number(e.target.value))))
                }
              />
            </label>
            <label>
              Monthly maintenance (CAD)
              <input
                aria-label="Monthly maintenance"
                type="number"
                min="0"
                max="10000"
                value={fees}
                onChange={(e) =>
                  setFees(Math.max(0, Math.min(10000, Number(e.target.value))))
                }
              />
            </label>
          </div>
          <p className="form-help">
            This calculator models a down payment of 20% or more and does not
            calculate mortgage default insurance. The default rate is an
            illustration, not a lender quote.
          </p>
        </div>
        <aside className="payment-card">
          <p className="eyebrow">YOUR ESTIMATED MORTGAGE PAYMENT</p>
          <div className="payment-frequency">
            <button
              aria-pressed={frequency === "monthly"}
              onClick={() => setFrequency("monthly")}
            >
              Monthly
            </button>
            <button
              aria-pressed={frequency === "biweekly"}
              onClick={() => setFrequency("biweekly")}
            >
              Biweekly equivalent
            </button>
          </div>
          <output aria-live="polite" aria-label="Estimated mortgage payment">
            {money(amount)}
          </output>
          <p>
            {frequency === "monthly"
              ? "per month"
              : "per two-week period, annualized equivalent"}
          </p>
          <dl>
            <div>
              <dt>Mortgage principal</dt>
              <dd>{money(principal)}</dd>
            </div>
            <div>
              <dt>Down payment</dt>
              <dd>{money((price * down) / 100)}</dd>
            </div>
            <div>
              <dt>Monthly mortgage</dt>
              <dd>{money(monthly)}</dd>
            </div>
            <div>
              <dt>Monthly tax + maintenance</dt>
              <dd>{money(tax + fees)}</dd>
            </div>
            <div className="payment-total">
              <dt>Estimated monthly total</dt>
              <dd>{money(monthly + tax + fees)}</dd>
            </div>
          </dl>
          <Link to="/contact" className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap light">
            Talk through your next move <ArrowUpRight size={17} />
          </Link>
        </aside>
      </section>
      <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%] calculator-notes">
        <h2>What sits behind the estimate.</h2>
        <div className="three-columns grid [grid-template-columns:repeat(3,_1fr)] [gap:40px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:27px]">
          <div>
            <h3>One scenario, held constant.</h3>
            <p>
              Mortgage payments use a nominal annual rate compounded
              semi-annually, with monthly payments over the selected
              amortization. The estimate assumes that rate stays constant for
              the full period.
            </p>
          </div>
          <div>
            <h3>Room for the other costs.</h3>
            <p>
              The total adds only your monthly property-tax and maintenance
              inputs. Insurance, utilities, closing costs, repairs and lender
              charges are excluded. Enter figures that reflect the home you’re
              considering.
            </p>
          </div>
          <div>
            <h3>A starting point for a lender.</h3>
            <p>
              This is a planning tool, not a financing offer or an approval.
              Lender calculations, eligibility and renewal terms may differ. The
              biweekly figure is a monthly payment converted to 26 periods, not
              an accelerated schedule.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
function Contact() {
  const [params] = useSearchParams();
  const [draft, setDraft] = useState("");
  const [interest, setInterest] = useState(
    params.has("property") ? "A property" : "Buying",
  );
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const body = `Hello John,\n\nMy name is ${d.get("name")}. I'm interested in ${interest.toLowerCase()}.\n${params.get("property") ? `Property: ${params.get("property")}\n` : ""}Preferred timing: ${d.get("timing")}\nEmail: ${d.get("email")}\nPhone: ${d.get("phone") || "Not provided"}\n\n${d.get("message")}\n\nSent from the Realty Property Search concept website.`;
    setDraft(
      `mailto:johnparker@rogers.com?subject=${encodeURIComponent(`Realty Property Search enquiry · ${interest}`)}&body=${encodeURIComponent(body)}`,
    );
  }
  return (
    <>
      <section className="contact-layout grid [grid-template-columns:1fr_1fr] [gap:110px] max-[1200px]:[gap:60px] max-[900px]:[gap:35px] max-[700px]:[grid-template-columns:1fr] max-[700px]:[gap:35px] section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%]">
        <div>
          <p className="eyebrow">START WITH A CONVERSATION</p>
          <h1>
            Tell us what
            <br />
            <em>comes next.</em>
          </h1>
          <p className="lead">
            A new neighbourhood. A little more room. A home you’re ready to
            leave. Whatever the next chapter looks like, start with the details
            that matter to you.
          </p>
          <div className="contact-details">

            <a href="mailto:johnparker@rogers.com">
              <Mail />
              <span>
                <small>WRITE A NOTE</small>johnparker@rogers.com
              </span>
            </a>
            <p>
              <MapPin />
              <span>
                <small>THE AREA</small>Toronto & Greater Toronto Area
              </span>
            </p>
          </div>
          <p className="form-help">
            Portfolio enquiries go to John Parker. This concept form prepares an email for you to review in your own email
            app.
          </p>
        </div>
        <form className="contact-form [padding:36px] max-[900px]:[padding:26px] max-[700px]:[padding:27px_22px]" onSubmit={submit}>
          <h2>A few details to get started.</h2>
          {params.get("property") && (
            <p className="property-enquiry">
              Home: <strong>{params.get("property")}</strong>
            </p>
          )}
          <label>
            Your name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <div className="form-row grid [grid-template-columns:1fr_1fr] [gap:20px] max-[900px]:[gap:14px] max-[700px]:[gap:15px]">
            <label>
              Email address
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={180}
              />
            </label>
            <label>
              Phone <small>(optional)</small>
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={40}
              />
            </label>
          </div>
          <div className="form-row grid [grid-template-columns:1fr_1fr] [gap:20px] max-[900px]:[gap:14px] max-[700px]:[gap:15px]">
            <label>
              I’d like to discuss
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              >
                {[
                  "Buying",
                  "Selling",
                  "Leasing",
                  "A property",
                  "Something else",
                ].map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </label>
            <label>
              My timing
              <select name="timing">
                <option>Just exploring</option>
                <option>Within 3 months</option>
                <option>Within 6 months</option>
                <option>Later this year</option>
              </select>
            </label>
          </div>
          <label>
            What would you like us to know?
            <textarea
              name="message"
              rows={5}
              required
              maxLength={3000}
              placeholder="Your preferred areas, what matters in a home, or a question to start with…"
            />
          </label>
          <p className="form-help">
            Your details aren’t submitted to a server. Preparing an email
            doesn’t send it.
          </p>
          <button className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap" type="submit">
            Prepare my email <ArrowUpRight size={17} />
          </button>
          {draft && (
            <div className="email-ready" role="status">
              <Check size={20} />
              <div>
                <strong>Your email is ready to review.</strong>
                <p>
                  Open your email app, check the message and choose whether to
                  send it.
                </p>
                <a className="text-link inline-flex items-center [gap:14px] [padding-bottom:6px]" href={draft}>
                  Open email draft <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          )}
        </form>
      </section>
      <section className="contact-image">
        <img
          src="/images/properties/interior-08.webp"
          alt="AI-generated open kitchen and dining space"
          loading="lazy"
        />
        <p>
          Every good move starts
          <br />
          with a little <em>perspective.</em>
        </p>
      </section>
    </>
  );
}
function NotFound() {
  return (
    <section className="section [padding:85px_7%] max-[1200px]:[padding:65px_5%] max-[700px]:[padding:55px_6%] empty-state text-center [padding:100px_20px] flex flex-col items-center [gap:20px] max-[700px]:[padding:65px_20px]">
      <p className="eyebrow">NOT FOUND</p>
      <h1>A different path home.</h1>
      <p>We couldn’t find that page or property in this collection.</p>
      <Link className="button inline-flex items-center justify-center [gap:16px] [padding:17px_24px] whitespace-nowrap" to="/find-your-home">
        Browse the homes <ArrowRight size={17} />
      </Link>
    </section>
  );
}
export default function App() {
  const [stored, setStored, storageError] = usePersisted<string[]>(
    storageKey,
    [],
  );
  const saved = Array.isArray(stored)
    ? stored.filter(
        (id) => typeof id === "string" && properties.some((p) => p.id === id),
      )
    : [];
  const toggle = (id: string) =>
    setStored((current) => {
      const items = Array.isArray(current) ? current : [];
      return items.includes(id)
        ? items.filter((x) => x !== id)
        : [...items, id];
    });
  return (
    <SavedContext.Provider value={{ saved, toggle }}>
      <ScrollReset />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      {storageError && (
        <div role="status" className="storage-message">
          Browser storage is unavailable. Saved homes will last only for this
          visit.
        </div>
      )}
      <main id="main">
        <Routes>
          <Route path="/" element={isSearchSite ? <><NeighbourhoodHero /><Listings /></> : <Home />} />
          <Route path="/find-your-home" element={<Listings />} />
          <Route path="/new-listings" element={<Listings newOnly />} />
          <Route path="/map" element={<Listings mapDefault />} />
          <Route path="/saved" element={<Listings savedOnly />} />
          <Route path="/property/:id" element={<PropertyRoute />} />
          <Route path="/location/:id" element={<PropertyRoute />} />
          <Route path="/location" element={<Navigate to="/map" replace />} />
          <Route path="/about" element={<About />} />
          <Route path="/buy" element={<Guide kind="buy" />} />
          <Route path="/sell" element={<Guide kind="sell" />} />
          <Route path="/neighbourhoods" element={<Neighbourhoods />} />
          <Route path="/mortgage-calculator" element={<Mortgage />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/Find_Your_Home"
            element={<Navigate to="/find-your-home" replace />}
          />
          <Route
            path="/New_Listings"
            element={<Navigate to="/new-listings" replace />}
          />
          <Route
            path="/Mortgage_Calculator"
            element={<Navigate to="/mortgage-calculator" replace />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </SavedContext.Provider>
  );
}
