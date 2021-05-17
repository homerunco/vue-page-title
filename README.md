<p align="center">
  <a href="https://npm.im/@homerun/vue-page-title">
    <img src="https://badgen.net/npm/v/@homerun/vue-page-title">
  </a>
  <a href="https://npm.im/homerun/vue-page-title">
    <img src="https://badgen.net/npm/dw/homerun/vue-page-title?color=blue">
  </a>
  <a href="https://bundlephobia.com/result?p=@homerun/vue-page-title">
    <img src="https://badgen.net/bundlephobia/minzip/@homerun/vue-page-title">
  </a>
</p>

# vue-page-title

Vue.js page title manager

## Requirements

Vue ^2.0.0

## Install

Install the npm package

```bash
yarn add @homerun/vue-page-title
```

Install the plugin inside your application
```js
import Vue from "vue"
import VuePageTitle from "@homerun/vue-page-title"

Vue.use(VuePageTitle)
```

## Usage
Use the `title` option inside your component to update the HTML document title.

```js
export default {
  name: "MyComponent",

  title: "My title"
}
```
It is also possible to set the title manually. 
This works perfectly when data comes from an async operation and the page title value depends on it.

```js
export default {
  name: "MyComponent",

  mounted () {
    this.$setPageTitle("My title")
  }
}
```

### Render title inside the component template
It's possible to also render the title inside the template, by using the global available property `$title`.

This will only render the title with no suffix.

```html
<template>
  <div>
    <h1>{{ $title }}</h1>
  </div>
</template>
```

### Add a suffix to the page title
```js
import Vue from "vue"
import VuePageTitle from "@homerun/vue-page-title"

Vue.use(VuePageTitle, {
  suffix: "MyApp" // default value: null
})
```
The plugin will append the suffix to the value of the page title separated by a divider.
In case there is no value set, the suffix will be the page title.

### Change title divider
```js
import Vue from "vue"
import VuePageTitle from "@homerun/vue-page-title"

Vue.use(VuePageTitle, {
  divider: "|" // default value: '-'
})
```

### Use together with VueRouter 
The plugin accepts the VueRouter instance as an optional parameter to track all route titles and automatically apply it to the document title.

```js
import Vue from "vue";
import VueRouter from "vue-router";
import VuePageTitle from "@homerun/vue-page-title";

const router = new VueRouter({
  routes: [
    {
      name: "home",
      path: "/",
      meta: {
        title: "Home page",
      },
    },
    {
      name: "about",
      path: "/about",
      meta: {
        title: "About page",
      },
    },
  ],
});

Vue.use(VueRouter);

Vue.use(VuePageTitle, {
  router,
});

```

#### Stop updating title
In specific use cases, we might want to stop updating the document title and keep whatever is the current value by adding the `inheritPageTitle` property to `true` inside the route meta object

```js
const routes = [
  {
    name: "home",
    path: "/",
    meta: {
      inheritPageTitle: true, // default value: false
    },
  },
];
```


## Issues and features requests

Please drop an issue [here](https://github.com/homerunco/vue-page-title/issues), if you find something that doesn't work, or request a feature

