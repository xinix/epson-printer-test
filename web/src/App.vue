<script setup lang="ts">
import { reactive } from 'vue';
import { EpsonPrinter } from './printer/epson-printer';

const state = reactive({
  ip: '10.0.10.177'
})

const onPrint = () => {

  const printer = new EpsonPrinter({ ip: state.ip })
  printer.feed()
  printer.header('1234', 'takeout')
  printer.line()
  printer.feed()
  for (let i = 0; i < 10; i++) {
    printer.text('Dat gade gij niet bepalen he vriend!')
  }
  printer.line('medium')
  printer.feed()
  printer.align('center')
  printer.bold('Werkt het al?')
  printer.feed(60)
  printer.cut()
  printer.print(null)

}
</script>

<template>
  <form @submit.prevent="onPrint">
    <h1>Print a test ticket</h1>
    <p>
      <input type="text" v-model="state.ip">
    </p>
    <button type="submit">Print</button>
  </form>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
