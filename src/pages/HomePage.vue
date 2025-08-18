<template>
	<q-page class="q-pa-md">
		<div>
			<div class="row q-col-gutter-md q-mt-lg justify-center" style="height: 600px;"> 
			<div class="col-12 col-md-6 flex flex-center">
				<img
				src="../assets/olostechLogo.svg"
				style="width: 85%; max-width: 85%; box-sizing: border-box;"
				/>
			</div>
			</div>
		</div>
	</q-page>
</template>

<script setup>

defineProps(['user'])

</script>

<script>
export default {
  name: 'HomePage',
}
</script>
