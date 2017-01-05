Helper library for creating final stubs for [proxyquire](https://github.com/thlorenz/proxyquire/).
Used to remove some pain from mocking imports/requires in unit tests.

usage: __npm i resolvequire__  remember – npm package name must be in lower case

For example, you have a file
```js
import module1 from "./module1"
import module2 from "./module2.js"
import module3 from "common/module3.js"
import lib1 from "lib1"
import helper1 from "stuff/helper1"
```
But then, after babel for example, it will become
```js
var module1 = require("./module1.js"); // local
var module2 = require("./module2.js"); // local
var module3 = require("../../../common/module3.js"); // *babeled* to new location
var lib = require("lib1"); // node_module
var helper1 = require("stuff/helper1"); // found in project root
```

Next you have 100500 files, all having same deps, and you want your unit tests to mock every dependancy they have.
```js
 var mockedModule = proxyquire.load('../moduleN.js',{
  './module1.js':{}, // will not passs
  './module2':{}, // will not pass
  'common/module3.js':{}, // will not pass
  'lib1':{}, // this will pass :P
  'stuff/module4.js':{}, // will not pass
 });
```
For you - all files have same dependancies. But all files lays in different locations, and `true` requires will be different.

For mocking you can use [proxyquire](https://github.com/thlorenz/proxyquire/), but in every case you have to provide extract stubs to overwrite.
All your files can import modules in same maner, but in final code all requires will be relative to a file. 
Let me repeat - they all will be different. They all will require different setup for proxyquire.

Lets solve it. (better solution is to use https://github.com/thlorenz/proxyquire/pull/148)

```js
 var mockedModule = withResolve(proxyquire, '../moduleN.js',{
   /*stubsInAnyForm*/
 })
```
 
One command, and it will works.
 
How?

resolveQuire will try to find form of a fileName, that will be used by target file.
It will also make a twin for keys like 'module' -> 'module.js'. And nodejs require do.

It just work. Work absolutely not perfect, cos it is very hard to `invent` names of files requires.

__PS:__
PR-148, or https://github.com/theKashey/proxyquire works from opposite direction - it overloads proxyquire resolve logic, and tries to find a match between
known require and know stub key. No place for 'inventions'. But a good place for RegEx or straight logic. 
Might work more stable and in a better way. 