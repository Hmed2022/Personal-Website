import nbaUrl from "../assets/Thumbnails/Thumbnail-AllStar.png";
import klayUrl from "../assets/Thumbnails/Klay.gif";
import tunUrl from "../assets/Thumbnails/Tunisiainfo.gif";
import AllStarIntro from "../MyProjects/All-Star/AllStarIntro.svelte";

export const imageData = [
  {
    url: nbaUrl,
    title: "The Decline of the All-Star game",
    desc: "Data Analysis | Data Vizualisation",
    href: "/#/allstarintro",
    show: true,
    tags: "all,svelte,d3,dataviz,story,sql",
  },
  {
    url: klayUrl,
    title: "Profanity in Tunisan Rap (Klay BBj)",
    desc: "Data Analysis | Data Vizualisation",
    href: "/#/allstarintro",
    show: false,
    tags: "all,svelte,d3,dataviz,story,sql,tunisia",
  },
  {
    url: tunUrl,
    title: "Tunisia in Graphics: An Infographic Odyssey",
    desc: "Infographic | Data Visualization",
    href: "/#/tuninfointro",
    show: false,
    tags: "all,dataviz,info,tunisia",
  },
  // {
  //   url: "https://via.placeholder.com/350x350/1",
  //   title: "Lorem Ipsum",
  //   desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
  // },
];
