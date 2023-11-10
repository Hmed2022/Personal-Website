<script>
    let monuments = [
      { region: 'Ariana', landmarks: ['Ennahli Park', 'The Andalusian Bridge'] },
      { region: 'Gafsa', landmarks: ['Ancient Roman Pools'] },
      { region: 'Kebili', landmarks: ['Chott El Jerid'] },
      { region: 'Kef', landmarks: ['kasbah le kef'] },
      { region: 'Medenine', landmarks: ['Ksar Hallouf', 'El Ghriba Synagogue'] },
      { region: 'Sidi Bouzid', landmarks: ['Martyr Mohamed Bouazizi Square'] },
      { region: 'Siliana', landmarks: ['Maktaris ancient ruins'] },
      { region: 'Tozeur', landmarks: ['Tamerza Canyon Oasis'] }
    ];
  let governorates = [
      
       {
        name: 'Ben Arous',
        cities: [
          {
            name: "Rades",
            items: ['bridge at Radès/La Goulette - 50 Tnd (2009)']
          }
        ]
      },
      {
        name: 'Kasserine',
        cities: [
          {
            name: "Sbeïtla",
            items: ['Triumphal arch of Diocletian - 5 Tnd (1965)']
          }
        ]
      },
          {
        name: 'Mahdia',
        cities: [
          {
            name: "El Djem",
            items: ['Triumphal arch of Diocletian - 5 Tnd (1965)']
          }
        ]
      },
      {
        name: 'Manouba',
        cities: [
          {
            name: "El Fahs",
            items: ['El Aroussia dam - 5 Tnd (1983)']
          }
        ]
      },
      {
        name: 'Nabeul',
        cities: [
          {
            name: "Korbous",
            items: ['Ariel View of the city- 1 Tnd (1980)']
          }
        ]
      },
          {
        name: 'Tataouine',
        cities: [
          {
            name: "Tataouine",
            items: ['Ksar of Ouled Soltane - 20 Tnd (2011)']
          }
        ]
      },
      {
        name: 'Bizerte',
        cities: [
          {
            name: "Bizerte",
            items: ['Oil refinery - 10 Tnd (1969)','Oil refinery - 1 Tnd (1973)']
          }
        ]
      },
      {
        name: 'Gabès',
        cities: [
          {
            name: "Gabès",
            items: ['Oasis - 10 Tnd (1969)','Ashtart’s offshore oil platforms - 10 Tnd (1986)']
          }
        ]
      },
       {
        name: 'Béja',
        cities: [
          {
            name: "Teboursouk",
            items: ['Temple of Jupiter in the ruins of Dougga - 1/2 Tnd (1958)', 'Romanesque ruins of the Capitol  - 10 Tnd (2005)']
          }
        ]
      },
      {
        name: 'Sfax',
        cities: [
          {
            name: "Sfax",
            items: ['Phosphoric acid plant- 1 Tnd (1965)','Central bank- 20 Tnd (1983)']
          }
        ]
      },
      {
        name: 'Zaghouan',
        cities: [
          {
            name: "Zaghouan",
            items: ['Roman ruins of the Temple of Water - 5 Tnd (1980)','Roman aqueducts - 5 Tnd (2022)']
          }
        ]
      },
      {
        name: 'Jendouba',
        cities: [
          {
            name: "Fernena",
            items: ['Ben Mitir dam - 1 Tnd (1985)']
          },
          {
            name: "Jendouba",
            items: ["Bridge located on the Mellègue river - 5 Tnd (1958)", 'Bridge located on the Mellègue river - 5 Tnd (1962)']
          }
        ]
      },
      {
        name: 'Monastir',
        cities: [
          {
            name: "Monastir",
            items: ['Bourguiba Mosque - 1/2 Tnd (1965)','Ancient mosaic from the Monastir Museum - 1/2 Tnd (1965)','Fort in Monastir - 1 Tnd (1972)','Port of Monastir - 20 Tnd (1980)']
          }
        ]
      },
          {
        name: 'Sousse',
        cities: [
          {
            name: "Sousse Medina",
            items: ['Medina of Sousse - 5 Tnd (1973)','Medina of Sousse- 20 Tnd (1980)','El Kantaoui Resort hotel- 20 Tnd (1983)']
          },
                    {
            name: "Enfidha",
            items: ['Terminal at Zine el Abidine Ben Ali airport- 50 Tnd (2009)']
          }
        ]
      },
      {
        name: 'Kairouan',
        cities: [
          {
            name: "Sebikha",
            items: ['Nebhana Dam- 10 Tnd (1980)','nterior of the great mosque of Kairouan- 5 Tnd (1958)','Arches of the interior of the great mosque of Kairouan - 5 Tnd (1962)']
          },
                  {
            name: "Kairouan",
            items: ['Great Mosque of Kairouan- 10 Tnd (1958)']
          }
        ]
      },
      
      
      
  
      
      {
        name: 'Tunis',
        cities: [
                   {
            name: "Carthage",
            items: ['Roman theater - 1 Tnd (1980)','Sidi Bou Saïd Marina - 20 Tnd (1983)','Punic port - 5 Tnd (1992)','El Abidine mosque - 10 Tnd (2005)','El Abidine mosque - 10 Tnd (2005)','Ancient city of Carthage - 5 Tnd (2014)','Corinthian column - 5 Tnd (2017)']
          },
                  {
            name: "La Goulette",
            items: ['Harbor of Goulette- 1/2 Tnd (1972)']
          },
                  
        ]
      },
      {
        name: '',
        cities: [
          {
            name: "Bardo",
            items: ['Chamber of Deputies- 20 Tnd (1992)']
          }
                  ,
                   {
            name: "Medina",
            items: ['Sadiki College - 5 Tnd (1965)','Panaroamic view of Tunis - 1/2 Tnd (1972)','Minaret of the Medina - 1 Tnd (1972)','Ezzitouna mosque - 5 Tnd (1980)','Sadiki College - 10 Tnd (1980)','Sidi Mehrez mosque - 20 Tnd (1992)','Sadiki College - 20 Tnd (2011)','Medersa El Bachia - 10 Tnd (2013)']
          },
                   {
            name: "Menzeh",
            items: ['National Stadium - 5 Tnd (1972)']
          },
                  
        ]
      }
      ,
      {
        name: '',
        cities: [
                   {
            name: "Tunis",
            items: ['The bay of Tunis - 1/2 Tnd (1973)','Tunis Science City- 30 Tnd (1997)','Punic port - 5 Tnd (1992)','City of Culture building - 50 Tnd (2009)','El Abidine mosque - 10 Tnd (2005)','Tunis Currency Museum - 50 Tnd (2011)','Place du Gouvernement  - 50 Tnd (2011)','The central square  - 50 Tnd (2011)','Banque Centrale de Tunisie headquarters  - 50 Tnd (2022)']
          },
        ]
      }
   
    ];
      
  </script>
  
  <div class="containerAll">
  
      
  <div class="containerImg">
      <img src="https://i.ibb.co/NShLNSG/Tunisian-BAnknotes.png" alt="Tunisia Map"/>
  </div>
          <div class="containerText">
                  <p>
            Tunisia's banknotes often showcase the nation's top tourist destinations and historic cities like Carthage, Dougga, and El Djem. The Tunis Governorate takes the lead with 26 representations, thanks to famous cities like El Medina and Carthage. Hot on its heels is a three-way tie at four mentions each for Monastir—Bourguiba's hometown—Sousse, and Kairouan, the latter known for the Great Mosque of Uqba. Yet, eight governorates remain unhighlighted on the currency since independence and the current administrative division. It's time to explore and propose monuments and landmarks that could best symbolize the essence of these underrepresented regions:
                  </p>
          
              <ul>
                {#each monuments as monument}
                  <li><strong>{monument.region}:</strong> {monument.landmarks.join(', ')}</li>
                {/each}
              </ul>
  
              <p> Take a look below at the Landmarks represented in the notes.</p>
  </div>
  </div>
  
  <div class="container">
    {#each governorates as governorate}
      <div class="governorate">
        <h2>{governorate.name}</h2>
        {#each governorate.cities as city}
          <div class="city">
            <h3>{city.name}</h3>
            <ul>
              {#each city.items as item}
                <li>{item}</li>
              {/each}
            </ul>
          </div>
        {/each}
      </div>
    {/each}
  </div>
  
  
  
  <style>
      img{
          height:450px;
          width:auto
      }
      p{
          font-family: Quicksand;
          font-size: 0.75em
      }
  
      li,ul{
              font-family: Quicksand;
          font-size: 0.85em;
          margin-top: 0;
          margin-bottom:0;
          color: #2C5056;
      }
  
      .containerAll {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: flex-start;
    }
  
    .containerText, .containerImg {
      flex: 1; /* This will make both containers take up equal width */
      padding: 10px; /* Add some spacing around the content */
    }
  
    .containerText {
      /* Additional styles for text container if needed */
    }
  
    .containerImg {
      /* Additional styles for image container if needed */
      text-align: left; /* Aligns the image to the right side */
    }
  
  .container {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
      gap: 3px; /* Adds space between the columns */
      padding: 20px; /* Padding around the entire grid */
    }
  
    .governorate {
      position: relative; /* Position relative for pseudo-elements */
      background: #0000; /* Background color for each governorate block */
      padding: 5px; /* Padding inside each governorate block */
      border-radius: 5px; /* Optional: rounds the corners of the blocks */
    }
  
    .governorate::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px; /* or the height of your line */
      background: #90B5BB; /* color of your line */
    }
  
    h3 {
          font-family:Quicksand;
          font-size:1em;
      margin-top: 0;
          margin-bottom:0;
          color:#90B5BB
    }
       h2 {
          font-family:Quicksand;
          font-size:1.3em;
      margin-top: 0;
          margin-bottom:0;
          color: #2C5056;
    }
  </style>
  