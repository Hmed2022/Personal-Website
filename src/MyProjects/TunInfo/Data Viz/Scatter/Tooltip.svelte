<script>
    export let data;
    export let xScale;
    export let yScale;
  
  </script>
  
  <div class='tooltip' style="position: absolute;
    top: {yScale(data.Width)}px;
    left: {xScale(data.Height)}px">
      <p> <b>Value: </b>{data.Value} TND</p>
  <p><b>Issue: </b> {data.Issued}</p> 
      <p><b>Size: </b> {data.Height} x {data.Width}</p> 
  </div>
  
  <style>
    .tooltip {
          text-align:center;
      padding: 6px;
      background: white;
      border: 1px solid rgba(0, 0, 0, 0.5);
      pointer-events: none;
      transition: top 300ms ease, left 300ms ease;
    }
  
  
      p{
          font-family: Quicksand;
          font-size:0.8rem;
      }
      
  </style>