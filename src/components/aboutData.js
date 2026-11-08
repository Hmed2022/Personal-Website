// Content for the "More about me" page (src/pages/About.svelte).
// Edit this file to add volunteering roles or tick off new NBA arenas — the page updates itself.

// ---------- Volunteering ----------
// Add a new object to the list for each role. Everything except `org` is optional.
//   category: 'Sport' | 'Music & arts' | 'Fitness' | 'Community' (sets the icon + colour)
//   featured: true  → shown as the big card with a photo gallery (use it for one or two roles)
//   link:     the event's website
// Photos live in src/assets/WCPhotos/web/ (web-sized copies; originals are kept next to them).
const wc = import.meta.glob('../assets/WCPhotos/web/*.jpg', { eager: true, import: 'default' });
const wcPhoto = (n) => wc[`../assets/WCPhotos/web/${n}.jpg`];

export const volunteering = [
  {
    featured: true,
    category: 'Sport',
    role: 'Spectator Services Volunteer',
    org: 'FIFA World Cup Qatar 2022',
    when: '2022',
    where: 'Al Janoub & Khalifa International stadiums, Qatar',
    summary:
      "I was one of the 20,000 volunteers at the World Cup, the smiling face and helping hand for fans from every corner of the world. I split my shifts between Al Janoub Stadium in Al Wakrah and Khalifa International, made friends from dozens of countries, and even got to watch Tunisia and Morocco play. It's a story I'll be telling for years.",
    photos: [
      { src: wcPhoto(1), caption: 'The Al Janoub Stadium spectator services team' },
      { src: wcPhoto(10), caption: "First day at work: couldn't ask for a better crew" },
      { src: wcPhoto(2), caption: 'A tribute to all 20,000 volunteers. Can you spot my name?' },
      { src: wcPhoto(3), caption: 'Al Janoub Stadium, where I spent half my shifts' },
      { src: wcPhoto(4), caption: 'Khalifa International Stadium, the other half' },
      { src: wcPhoto(6), caption: "You can't feel tired with these guys" },
      { src: wcPhoto(8), caption: 'Small world: meeting another Tunisian volunteer' },
      { src: wcPhoto(7), caption: 'The World Cup mosaic' },
      { src: wcPhoto(9), caption: 'Al Bayt Stadium' },
      { src: wcPhoto(5), caption: 'The volunteer canteen after a long shift' }
    ]
  },
  {
    category: 'Music & arts',
    role: 'Festival Volunteer',
    org: 'Lotus World Music & Arts Festival',
    when: '',
    where: 'Bloomington, Indiana',
    summary:
      'Helping run a festival that fills downtown Bloomington with musicians and artists from around the world.',
    link: 'https://lotusfest.org/'
  },
  {
    category: 'Fitness',
    role: 'Event Volunteer',
    org: 'HYROX Denver',
    when: '',
    where: 'Denver, Colorado',
    summary:
      'Keeping a HYROX fitness race moving: runs, sleds, wall balls and a lot of cheering athletes across the finish line.',
    link: 'https://hyrox.com/'
  }
  // {
  //   category: 'Community',
  //   role: 'Your role',
  //   org: 'Organization',
  //   when: '2024',
  //   where: 'City',
  //   summary: 'What you did and what it meant to you.',
  //   photos: []
  // },
];

// ---------- NBA arena bucket list ----------
// To tick off an arena: set `visited: true` (and drop a photo into src/assets/NBALogo/web/ and
// set `photo` to its file name if you have one).
const logos = import.meta.glob('../assets/NBALogo/*.png', { eager: true, import: 'default' });
const pics = import.meta.glob('../assets/NBALogo/web/*.jpg', { eager: true, import: 'default' });
const t = (name, arena, conf, logo, photo = null, visited = !!photo) => ({
  name, arena, conf, visited,
  logo: logos[`../assets/NBALogo/${logo}.png`],
  photo: photo ? pics[`../assets/NBALogo/web/${photo}.jpg`] : null
});

export const arenas = [
  // East
  t('Atlanta Hawks', 'State Farm Arena', 'East', 'Atlanta', 'hawks'),
  t('Boston Celtics', 'TD Garden', 'East', 'Celtics', 'bos'),
  t('Brooklyn Nets', 'Barclays Center', 'East', 'Nets', 'nets'),
  t('Charlotte Hornets', 'Spectrum Center', 'East', 'Hornets', 'hornet'),
  t('Chicago Bulls', 'United Center', 'East', 'Bulls', 'bull'),
  t('Cleveland Cavaliers', 'Rocket Mortgage FieldHouse', 'East', 'Cavaliers', 'clev'),
  t('Detroit Pistons', 'Little Caesars Arena', 'East', 'Detroit', 'pis'),
  t('Indiana Pacers', 'Gainbridge Fieldhouse', 'East', 'Pacers', 'pace'),
  t('Miami Heat', 'Kaseya Center', 'East', 'Heat'),
  t('Milwaukee Bucks', 'Fiserv Forum', 'East', 'Bucks', 'buck'),
  t('New York Knicks', 'Madison Square Garden', 'East', 'Knicks', 'knicks'),
  t('Orlando Magic', 'Kia Center', 'East', 'Magic'),
  t('Philadelphia 76ers', 'Wells Fargo Center', 'East', 'Sixers', 'sixers'),
  t('Toronto Raptors', 'Scotiabank Arena', 'East', 'Raptors'),
  t('Washington Wizards', 'Capital One Arena', 'East', 'Wizards', 'wiz'),
  // West
  t('Dallas Mavericks', 'American Airlines Center', 'West', 'Dallas', 'mavs'),
  t('Denver Nuggets', 'Ball Arena', 'West', 'Denver'),
  t('Golden State Warriors', 'Chase Center', 'West', 'Golden'),
  t('Houston Rockets', 'Toyota Center', 'West', 'Rockets', 'hou'),
  t('LA Clippers', 'Intuit Dome', 'West', 'Clip'),
  t('Los Angeles Lakers', 'Crypto.com Arena', 'West', 'Lakers'),
  t('Memphis Grizzlies', 'FedExForum', 'West', 'Memphis'),
  t('Minnesota Timberwolves', 'Target Center', 'West', 'Timber', 'wolves'),
  t('New Orleans Pelicans', 'Smoothie King Center', 'West', 'Pelicans', 'peli'),
  t('Oklahoma City Thunder', 'Paycom Center', 'West', 'Thunder', 'okc'),
  t('Phoenix Suns', 'Footprint Center', 'West', 'Suns'),
  t('Portland Trail Blazers', 'Moda Center', 'West', 'Portland'),
  t('Sacramento Kings', 'Golden 1 Center', 'West', 'Kings'),
  t('San Antonio Spurs', 'Frost Bank Center', 'West', 'Spurs'),
  t('Utah Jazz', 'Delta Center', 'West', 'Jazz')
];
