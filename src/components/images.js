import nbaUrl from "../assets/Thumbnails/NBAArticle.gif";
import klayUrl from "../assets/Thumbnails/klay.png";
import CardMagicUrl from "../assets/Thumbnails/magic.gif";
import tunUrl from "../assets/Thumbnails/Title-Tuninfo.gif";
import namesUrl from "../assets/Thumbnails/names.gif";

// Each project:
//   tags   topics the home page filters by (sports, tunisia, culture, math...) + legacy tool tags
//   tools  shown as small chips on the card ("Built with")
//   alt    describes the thumbnail for screen readers
export const imageData = [
  {
    url: nbaUrl,
    rank: 1,
    title: "The Decline of the All-Star game",
    desc: "Data Analysis | Data Visualization",
    description:
      "An interactive data visualization exploring the declining viewership and engagement in NBA All-Star games over the years.",
    href: "/#/allstar",
    tools: ["Svelte", "D3", "SQL"],
    alt: "Animated title card of the story: The Decline of the All-Star Game",
    show: true,
    lang: "EN",
    tags: "all,svelte,d3,dataviz,story,sports,sql",
  },
  {
    url: namesUrl,
    rank: 2,
    title: "The Names We Memorized Before We Understood",
    desc: "Story | Data Visualization ",
    description:
      "Many Muslims know the 99 Names by heart. But where do they actually come from?",
    href: "/#/names",
    tools: ["Svelte"],
    alt: "Animated Kufi calligraphy of the 99 Names, from the story The Names We Memorized Before We Understood",
    show: true,
    lang: "AR | EN",
    tags: "all,dataviz,story,tunisia,svelte,arabic,culture",
  },
  {
    url: klayUrl,
    rank: 4,
    title: "Klay BBJ: A Mirror of Tunisian Society",
    desc: "Data Analysis | Data Visualization",
    description:
      "A case study on one of Tunisia's most iconic artists, and how his music mirrors the duality of Tunisian society.",
    href: "/#/klay",
    tools: ["Svelte", "D3", "SQL"],
    alt: "Illustrated portrait of the Tunisian rapper Klay BBJ",
    show: false,
    lang: "AR",
    tags: "all,svelte,d3,dataviz,story,sql,tunisia,arabic,culture",
  },
  {
    url: tunUrl,
    rank: 5,
    title: "Chronicales of Tunisian banknotes",
    desc: "Infographic | Data Visualization",
    description:
      "An infographic journey through the history and design evolution of Tunisian currency and banknotes.",
    href: "/#/tuninfo",
    tools: ["Svelte", "D3"],
    alt: "Animated title of The Chronicles of Tunisian Banknotes, with portraits from the notes",
    show: false,
    lang: "EN",
    tags: "all,dataviz,info,tunisia,svelte,d3,interactive,arabic,culture",
  },
  {
    url: CardMagicUrl,
    rank: 3,
    title: "The Math Behind the Magic: The Three Pile Trick",
    desc: "Explainer | Interactive",
    description:
      'An interactive piece I made during my fellowship with <a href="https://pudding.cool" target="_blank" rel="noopener noreferrer">The Pudding</a>, explaining the math behind a classic card trick.',
    href: "/#/CardMagic",
    tools: ["Svelte"],
    alt: "Animation of playing cards being dealt into three piles for the three pile card trick",
    show: true,
    lang: "EN",
    tags: "all,interactive,svelte,math",
  },
  // {
  //   url: "https://via.placeholder.com/350x350/1",
  //   title: "Lorem Ipsum",
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  // },
];

// Topic filters (All · Sport · Tunisia & culture · Math) only appear once there are enough
// projects for filtering to be useful. Change the number to show them sooner or later.
export const FILTERS_MIN_PROJECTS = 6;
export const showFilters = imageData.filter((p) => p.show).length >= FILTERS_MIN_PROJECTS;


// title: "Tunisia in Graphics: An Infographic Odyssey",
