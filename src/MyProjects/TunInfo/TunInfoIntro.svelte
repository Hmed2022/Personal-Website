<script>

    import tunURL from './Components/Title-Tuninfo.gif'

    import Footer from "../../components/footer.svelte";
    import { style } from 'svelte-body';

    function redirectToTunInfo() {
        window.location.hash = '/tuninfo';
    }
</script>



<section>
	<div class="prose">
		<div style='text-align:center'>
			<h1>
				Chronicles of Tunisian Banknotes
			</h1>
            <h3>
                Portraits and Landmarks
            </h3>
		</div>
		<!-- <div class="center-line1"></div>
		<div class="center-line2"></div> -->

        <div style="text-align:center">
            <div class="preview">
                <img src="{tunURL}" alt="Preview Article">
            </div>
        </div>
			
		<h3>
				Brief Intoduction
			</h3>
		<p>
			This project isn't just a labor of love; it's a heartfelt tribute to my cherished Tunisia. But let's be clear: this isn't your average rundown of facts and figures. Oh no, we're turning the humble banknote from mere currency to a vibrant window, offering a glimpse into Tunisia's rich culture, monuments, and the ups and downs of its political and cultural scene. Who needs history books when you've got this data visualization? By the time you're done exploring, you'll be practically an expert on Tunisia, whether you're a traveler or a history enthusiast with a thirst for knowledge. <br> <br>So buckle up—we're about to take a deep dive into Tunisia's soul, one banknote at a time!
		</p>

		<div style="text-align:center">


           
           
                <button on:click={redirectToTunInfo}  style="background-color: #476b8d">
                    Click here to read the article
                </button>
            

          

		</div>

			<h3>
				Technologies Employed:
			</h3>

		<div class="lists">
            <li>
                <b>D3.js & Svelte:</b> Web-based Data Visualization
            </li>
					<li>
					<b>Adobe Illsutrator/Photoshop & Figma:</b> Design
				</li>
				<li>
					<b>Tableau:</b>  Data Visualization and Insight
				</li>
				<li>
					<b>Svelte:</b>  Web Development
				</li>
		</div>


        <!-- <h3>
            Project Overview:
        </h3>
		<div class="lists">
			<li>
			<b>Duration:</b> Approximately 3 months
		</li>
		<li>
			<b>Process:</b> Most Time comusing projct from design Perspective, as I had to covert every Baknote 
            to vector like using Illsutrarot and Figma. data collection was also tirint
		</li>
</div> -->


	</div>
</section>

<svelte:body use:style={"background-color: #FDF6F5;"} />


<Footer/>

<style>

    @font-face {
		font-family: "NeoSansMedium";
		src: url("../../assets/Fonts/NeoSansMediumTR.ttf")
			format("truetype");
	 }



        .center-line1 {
            margin-right:20%;
            margin-left: 20%;
            align-content:center;
        height: 4px;
        background-color:#733122; /* Grey color */
    
    
      }
      .center-line2 {
        margin-top: 1px;
            margin-right:20%;
            margin-left: 20%;
            align-content:center;
        height: 4px;
        background-color:#4D6473; /* Grey color */
    
    
      }
       
        .preview{
            margin-bottom: 5%;
        }

        img{
            max-width: 100%;
            height: auto;
            border: 2px solid rgba(186, 146, 120, 0.655); 
            /* padding: 5px; */
            
        }
        h3 {
            font-family: 'NeoSansMedium', sans-serif;
            font-size: 1.4rem;
            color: #2e4b4c;
        }
    
        li,p{
            font-family: 'Jost', sans-serif;
            font-size: 1.2rem;
            color: #403F3E;
        }
    
        h1{
            font-family: 'NeoSansMedium', sans-serif;
            font-size: 2rem;
            color: #2e4b4c;
            margin-bottom: -3%;
        }
        .lists {
            margin-left: 5%
        }
         section {
            margin: 2rem auto 4rem;
        }
    
         .prose{
            max-width: 40rem;
            margin: 1rem auto;
        }
    
         button {
            border: none;
            padding: 0.5rem 2rem;
            color: #fff;
            font-size: 1.5rem;
            border-radius: 0.2rem;
            transition: all 250ms;
            transform-origin: center;
            /* box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25),
            inset 0px -2px 3px rgba(0, 0, 0, 0.25); */
            font-family: 'Jost', sans-serif;
            font-weight:300;
            margin-bottom: 5%;
        }
        button:hover {
            cursor: pointer;
            transform: scale(0.99);
            box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
        }
    </style>
    