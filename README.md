# lowdb-titanium-adapter
[![Build Status](https://img.shields.io/travis/whitfin/lowdb-titanium-adapter.svg?label=unix)](https://travis-ci.org/whitfin/lowdb-titanium-adapter)

Titanium SDK adapter for the [LowDB](https://github.com/typicode/lowdb)
embedded database. You can use this library to persist LowDB databases
inside Titanium applications using the Titanium API.

### Usage

This module is on npm, so feel free to grab from there (as well as lowdb):

```shell
$ npm i lowdb lowdb-titanium-adapter
```

You can then configure it inside your application pretty easily, as the
API is still synchronous for the time being:

```javascript
const low = require('lowdb');
const TitaniumAdapter = require('lowdb-titanium-adapter');

const adapter = new TitaniumAdapter('my-database.json');
const db = low(adapter);
```

For futher usage, check out the [LowDB](https://github.com/typicode/lowdb)
documentation as the API is exactly the same.
