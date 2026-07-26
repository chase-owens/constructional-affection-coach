<script lang="ts">
	import Checkmark from "$lib/assets/icons/Checkmark.svelte";
	import CloudUpload from "$lib/assets/icons/CloudUpload.svelte";

	const onCreateAccount = () => {
		console.log("account created");
	};
</script>

<article
	class="flex h-full flex-col justify-between rounded-vintage border border-green-200 bg-green-50 p-8"
>
	<div class="flex justify-center">
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl text-green-800"
		>
			<CloudUpload class="size-12" />
		</div>
	</div>

	<div class="min-h-32">
		<h3 class="mt-2 text-center font-serif text-xl font-bold text-primary">Save to an Account</h3>

		<p class="mt-4 flex-1 text-center text-muted-dark">
			Access from any device and build your own library of constructional programs.
		</p>
	</div>

	<ul class="mt-6 space-y-2 text-sm">
		<li class="flex gap-2 text-green-800">
			<Checkmark class="size-4" /><span class="text-primary"> View on any device</span>
		</li>
		<li class="flex gap-2 text-green-800">
			<Checkmark class="size-4" /><span class="text-primary"> Save unlimited programs</span>
		</li>
		<li class="flex gap-2 text-green-800">
			<Checkmark class="size-4" /> <span class="text-primary">Stronger long-term persistence</span>
		</li>
	</ul>

	<button
		class="button-base button-primary mt-8 w-full cursor-pointer bg-green-800 font-medium text-white"
		onclick={onCreateAccount}
	>
		Create Free Account
	</button>

	<p class="h-20 pt-4 text-center text-xs text-muted">It takes less than a minute.</p>
</article>
