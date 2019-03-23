<template>
  <div id="app">
    <div>iter items</div>
    <ul>
      <li v-for="item in items" :key="item">{{item}}</li>
    </ul>
    <div>iter items by indexer</div>
    <ul>
      <li v-for="(item, i) in items" :key="item">{{items[i]}}</li>
    </ul>
    <button @click="setItem">this.$set(this.items, 0, 10)</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CircularBuffer from './circularBuffer';

@Component
export default class App extends Vue {
  private items = new CircularBuffer(4);

  private mounted() {
    this.items.push(1);
    this.items.push(2);
    this.items.push(3);
    this.items.push(4);
    this.items.push(5);
  }

  private setItem() {
    this.$set(this.items, 0, 10);
  }
}
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
