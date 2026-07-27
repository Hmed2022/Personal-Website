import nbaUrl from "../assets/Thumbnails/NBAArticle.gif";
import klayUrl from "../assets/Thumbnails/klay.png";
import CardMagicUrl from "../assets/Thumbnails/magic.gif";
import tunUrl from "../assets/Thumbnails/Title-Tuninfo.gif";
import namesUrl from "../assets/Thumbnails/names.gif";

export const imageData = [
  {
    url: nbaUrl,
    rank: 1,
    title: "The Decline of the All-Star game",
    desc: "Data Analysis | Data Vizualisation",
    description:
      "An interactive data visualization exploring the declining viewership and engagement in NBA All-Star games over the years.",
    href: "/#/allstar",
    show: true,
    lang: "EN",
    tags: "all,svelte,d3,dataviz,story,sql",
  },
  {
    url: namesUrl,
    rank: 2,
    title: "The Names We Memorized Before We Understood",
    desc: "Story | Data Visualization ",
    description:
      "Many Muslims know the 99 Names by heart. But where do they actually come from?",
    href: "/#/names",
    show: true,
    lang: "AR | EN",
    tags: "all,dataviz,story,tunisia,svelte",
  },
  {
    url: klayUrl,
    rank: 4,
    title: "Klay BBJ: A Mirror of Tunisian Society",
    desc: "Data Analysis | Data Vizualisation",
    description:
      "A case study on one of Tunisia's most iconic artists, and how his music mirrors the duality of Tunisian society.",
    href: "/#/klay",
    show: false,
    lang: "AR",
    tags: "all,svelte,d3,dataviz,story,sql,tunisia",
  },
  {
    url: tunUrl,
    rank: 5,
    title: "Chronicales of Tunisian banknotes",
    desc: "Infographic | Data Visualization",
    description:
      "An infographic journey through the history and design evolution of Tunisian currency and banknotes.",
    href: "/#/tuninfo",
    show: false,
    lang: "EN",
    tags: "all,dataviz,info,tunisia",
  },
  {
    url: CardMagicUrl,
    rank: 3,
    title: "The Math Behind the Magic",
    desc: "Explainer | Interactive",
    description:
      'An interactive visualization built as part of a fellowship with <a href="https://pudding.cool" target="_blank" rel="noopener noreferrer">The Pudding</a>, unraveling the elegant math behind a classic card magic trick.',
    href: "/#/CardMagic",
    show: false,
    lang: "EN",
    tags: "all,interactive,sql",
  },
  // {
  //   url: "https://via.placeholder.com/350x350/1",
  //   title: "Lorem Ipsum",
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  // },
];

// title: "Tunisia in Graphics: An Infographic Odyssey",
