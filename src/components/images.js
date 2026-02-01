import nbaUrl from "../assets/Thumbnails/NBAArticle.gif";
import klayUrl from "../assets/Thumbnails/Title-Tuninfo.gif";
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
    tags: "all,svelte,d3,dataviz,story,sql",
  },
  {
    url: namesUrl,
    rank: 1.5,
    title: "Profanity in Tunisan Rap (Klay BBj)",
    desc: "Data Analysis | Data Vizualisation",
    description:
      "A data-driven analysis of profanity usage in Tunisian rap music, focusing on artist Klay BBj's lyrical patterns.",
    href: "/#/klay",
    show: false,
    tags: "all,svelte,d3,dataviz,story,sql,tunisia",
  },
  {
    url: tunUrl,
    rank: 2,
    title: "Chronicales of Tunisian banknotes",
    desc: "Infographic | Data Visualization",
    description:
      "An infographic journey through the history and design evolution of Tunisian currency and banknotes.",
    href: "/#/tuninfo",
    show: true,
    tags: "all,dataviz,info,tunisia",
  },
  {
    url: namesUrl,
    rank: 3,
    title: "Rediscovery of the Names of Allah",
    desc: "Story | Data Visualization",
    description:
      "An interactive exploration and visualization of the 99 names of Allah, their meanings, and spiritual significance.",
    href: "/#/names",
    show: true,
    tags: "all,dataviz,story",
  },
  // {
  //   url: "https://via.placeholder.com/350x350/1",
  //   title: "Lorem Ipsum",
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  // },
];

// title: "Tunisia in Graphics: An Infographic Odyssey",
