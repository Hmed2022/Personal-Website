<script>
	import Header from "../components/Header.svelte";
  import { Input, TextInput } from '@svelteuidev/core';
  import { EnvelopeClosed, Avatar,Pencil2 } from 'radix-icons-svelte';
  import { Dodge } from 'svelte-dodge'; 
  import PageTransitions from "../components/PageTransitions.svelte";

</script>

<Header />

<PageTransitions>
<div class="contactus">
	<img src="/src/contactus.png" alt="Contact Us">
</div>

<div class='inputs'>
	<Input icon={Avatar} 
	placeholder="Your name"
	/>
	<br>
	
	<Input icon={EnvelopeClosed} 
	  placeholder="Your email Address"
	 />
	
	 <br>
	 <textarea></textarea>
	 <Dodge duration=0.3 dodge= true>
		<button>
			Submit
		 </button>
	 </Dodge>
	
</div>


</PageTransitions>

<style>

	textarea { 
		width: 100%;
		 height: 200px;
		border-color: #CED4D9; }

	.inputs {
		margin-left: 20%;
		margin-right: 20%;
	}

	.contactus {
		margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 20px;
  text-align: center;
}

.contactus img {
	width: 250px;
    height: auto;
  display: inline-block;
}
</style>