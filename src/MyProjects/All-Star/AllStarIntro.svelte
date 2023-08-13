<script>
import Footer from "../../components/footer.svelte";
import { style } from 'svelte-body';
import AllstarURL from "../../assets/Projects/AllStar/NBAArticle.gif"

function redirectToAllStar() {
        window.location.hash = '/allstar';
    }
</script>


<section>
	<div class="prose">
		<div style='text-align:center'>
			<h1>
						The decline of the All star game 
			</h1>
		</div>
			
		<h3>
				Brief Intoduction
			</h3>
		<p>
			Venturing into the realms of D3 and Svelte for the first time, I embarked on a visualization project. The result is a depiction of the decline of the All-Star game.
			<br>Observant fans recognize the game's issues, and this project employs data analysis and visualization to substantiate their intuitive concerns.
		</p>

		<div style="text-align:center">

           
                <button on:click={redirectToAllStar}  style="background-color: #476b8d">
                    Click here to read the article
                </button>
            

            <div class="preview">
                <img src="{AllstarURL}" alt="Preview Article">
            </div>

		</div>

			<h3>
				Technologies Employed:
			</h3>

		<div class="lists">
					<li>
					<b>PostgreSQL:</b> Data Transformation
				</li>
				<li>
					<b>Tableau:</b>  Data Visualization and Insight
				</li>
				<li>
					<b>Svelte:</b>  Web Development
				</li>
				<li>
					<b>D3.js & Svelte:</b> Web-based Data Visualization
				</li>
		</div>

        <h3>
            Design:
        </h3>
        <li>
            <b>Fonts used:</b> Action Cond Regular Trial, Quicksand and Futura.
        </li>
        <li>
            <b>Color Palette:</b>
        </li>


	</div>
</section>

<svelte:body use:style={"background-color: #f4f1ed;"} />

<Footer />

<style>
   
    .preview{
        margin-bottom: 5%;
    }
    img{
        max-width: 550px;
        height: auto;
        border: 2px solid rgba(186, 146, 120, 0.655); 
        padding: 5px;
        
    }
	h3 {
		font-family: Futura;
        font-size: 1.4rem;
        color: #403F3E;
	}

	li,p{
		font-family: Futura;
		font-weight:300;
        font-size: 1.2rem;
        color: #403F3E;
	}

	h1{
		font-family: Action Cond Regular Trial;
		font-size: 4.5rem;
		margin:0;
        color: #403F3E;
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
        font-family: Futura;
        font-weight:300;
        margin-bottom: 5%;
    }
    button:hover {
        cursor: pointer;
        transform: scale(0.99);
        box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.25);
    }
</style>
