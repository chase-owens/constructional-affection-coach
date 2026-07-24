<script lang="ts">
	import Shield from "$lib/assets/icons/Shield.svelte";
</script>

<div
	class="rounded-vintage border border-blue-200 bg-blue-50 p-8 h-full flex flex-col justify-between"
>
	<div class="flex gap-8 items-center text-primary">
		<Shield class="size-16"></Shield>
		<div class="flex flex-col gap-1 text-muted">
			<h4 class="font-bold">Your program is linked to this browser</h4>
			<p class="text-black text-sm">
				Creating an account helps ensure you never lose access, even if you switch your devices or
				clear your browser data.
			</p>
		</div>
	</div>
</div>
