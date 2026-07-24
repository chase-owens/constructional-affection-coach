<script lang="ts">
	import Checkmark from "$lib/assets/icons/Checkmark.svelte";
	import CloudUpload from "$lib/assets/icons/CloudUpload.svelte";

	const onCreateAccount = () => {
		console.log("account created");
	};
</script>

<article
	class="rounded-vintage border border-green-200 bg-green-50 p-8 h-full flex flex-col justify-between"
>
	<div class="flex justify-center">
		<div
			class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white text-3xl text-green-800"
		>
			<CloudUpload class="size-12" />
		</div>
	</div>

	<div class="h-32">
		<h3 class="mt-2 text-xl font-serif text-primary text-center font-bold">Save to an Account</h3>

		<p class="mt-4 flex-1 text-muted-dark text-center">
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
		class="admin-button-primary bg-green-800 text-white mt-8 w-full font-medium cursor-pointer"
		onclick={onCreateAccount}
	>
		Create Free Account
	</button>

	<p class="mt-4 text-center text-xs text-muted">It takes less than a minute.</p>
</article>
