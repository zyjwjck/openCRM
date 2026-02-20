<script>
	import { temperature, top_p, max_tokens, frequency_penalty, presence_penalty, system_prompt } from '$lib/stores';
	import { settings } from '$lib/stores';
</script>

<div class="space-y-4">
	<div class="flex justify-between items-center">
		<label class="text-text">System Prompt</label>
	</div>
	<div class="w-full">
		<textarea
			bind:value={$system_prompt}
			class="w-full p-3 bg-secondary text-text border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors min-h-[100px]"
			placeholder="Enter system prompt..."
		/>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="text-text">Temperature</label>
				<span class="text-text-secondary">{parseFloat($temperature).toFixed(1)}</span>
			</div>
			<input
				type="range"
				min="0"
				max="2"
				step="0.1"
				bind:value={$temperature}
				class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
			/>
		</div>

		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="text-text">Top P</label>
				<span class="text-text-secondary">{parseFloat($top_p).toFixed(1)}</span>
			</div>
			<input
				type="range"
				min="0"
				max="1"
				step="0.1"
				bind:value={$top_p}
				class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="text-text">Max Tokens</label>
				<span class="text-text-secondary">{$max_tokens}</span>
			</div>
			<input
				type="range"
				min="100"
				max="4000"
				step="100"
				bind:value={$max_tokens}
				class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
			/>
		</div>

		<div>
			<div class="flex justify-between items-center mb-2">
				<label class="text-text">Frequency Penalty</label>
				<span class="text-text-secondary">{parseFloat($frequency_penalty).toFixed(1)}</span>
			</div>
			<input
				type="range"
				min="-2"
				max="2"
				step="0.1"
				bind:value={$frequency_penalty}
				class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
			/>
		</div>
	</div>

	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-text">Presence Penalty</label>
			<span class="text-text-secondary">{parseFloat($presence_penalty).toFixed(1)}</span>
		</div>
		<input
			type="range"
			min="-2"
			max="2"
			step="0.1"
			bind:value={$presence_penalty}
			class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
		/>
	</div>
</div>