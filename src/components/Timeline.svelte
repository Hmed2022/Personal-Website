<script>
    let timelineItems = [
      { label: 'Data Collection', description: 'Gather relevant literary data', active: true },
      { label: 'Data Visualization', description: 'Create engaging visual representations' },
    ];
  
  import {
          Timeline,
          TimelineItem,
          TimelineSeparator,
          TimelineDot,
          TimelineConnector,
          TimelineContent,
          TimelineOppositeContent
      } from 'svelte-vertical-timeline';
  
      const options = [
          { title: 'Data Collection', desc:'Collecting data for Tunisia.', status:"in progress", time: 'Task Starts on 08/28/23' },
          { title: 'Data Visualization', desc:'Vizualise the data in an insighful way.',status:"not yet", time: 'Task starting date is TBD' },
          { title: 'Infographic Creation',desc:'Create the Infographic',status:"not yet", time: 'Task starting date is TBD' },
          { title: 'Article Development',desc:'Build the an article to showcase the project.',status:"not yet", time: 'Task starting date is TBD' }
      ];
  </script>
  
  <div class="container">
    <div class="title-box">
      <div class="title">Tunisia in Graphics: An Infographic Odyssey</div>
      <div class="subtitle">Infographic | Data Visualization</div>
    </div>
  </div>
  
  <Timeline position="alternate">
      {#each options as option}
          <TimelineItem>
              <TimelineOppositeContent slot="opposite-content">
                  <p>{option.time}</p>
              </TimelineOppositeContent>
              <TimelineSeparator>
                  {#if option.status == 'completed'}
                  <TimelineDot style={'background-color: #50D85D;'}/>
                  {:else if option.status == 'in progress'}
                      <TimelineDot style={'background-color: #7CD5E2;'}/>
                      {:else}
                      <TimelineDot style={'background-color: #D85A50;'}/>
                  {/if}
                  <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                  <h3>{option.title}</h3>
                  <p class="desc">{option.desc}</p>
              </TimelineContent>
          </TimelineItem>
      {/each}
  </Timeline>
  
  
  
  <style>

  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300&family=Quicksand:wght@300;400;700&display=swap');

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
  
    .title-box {
      background-color: white;
          box-shadow: 12px 12px 2px 1px rgba(166, 166, 166, 0.2);
      padding: 20px;
      text-align: center;
      width: 80%;
      border-radius: 10px;
    }
  
    .title {
      font-size: 1.6rem;
      font-weight: bold;
      margin-bottom: 10px;
      font-family: 'Quicksand', sans-serif;
      color:#CC5B63
      
    }
  
    .subtitle {
      font-size: 16px;
      color: #666;
      font-family: 'Jost', sans-serif;
      font-weight: 300;
    }
  
      h3 {
          letter-spacing: 1px;
          margin: 0;
          padding: 0;
          font-family: 'Quicksand', sans-serif
      }
      
      p {
          margin: 0;
          color: grey;
          font-family: 'Quicksand', sans-serif
      }
  
      .desc {
          color: black;
          font-size: 0.8rem
      }
  
  </style>