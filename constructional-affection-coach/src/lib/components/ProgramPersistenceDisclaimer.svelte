<script lang="ts">
	import Shield from "$lib/assets/icons/Shield.svelte";
</script>

<div
	class="flex h-full flex-col justify-between rounded-vintage border border-blue-200 bg-blue-50 p-8"
>
	<div class="flex items-center gap-8 text-primary">
		<Shield class="size-16"></Shield>
		<div class="flex flex-col gap-1 text-muted">
			<h4 class="font-bold">Your program is linked to this browser</h4>
			<p class="text-sm text-black">
				Creating an account helps ensure you never lose access, even if you switch your devices or
				clear your browser data.
			</p>
		</div>
	</div>
</div>
