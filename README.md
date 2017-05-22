Helper library for creating final stubs for [proxyquire](https://github.com/thlorenz/proxyquire/).
Used to remove some pain from mocking imports/requires in unit tests.

usage: __npm i resolvequire__  remember – npm package name must be in lower case
# About Proxyquire and Resolvequire.
Proxyquire just proxies nodejs's require in order to make overriding dependencies during testing. But it is quite old and having some interface limitations.

The way to extend Proxyquire abilities - [proxyquire-2](https://github.com/theKashey/proxyquire).
The way to enable webpack aliases - [proxyquire-webpack-alias](https://github.com/theKashey/proxyquire-webpack-alias) or this - resolvequire.
I can recommend using [proxyquire-2](https://github.com/theKashey/proxyquire) instead of proxyquire as long in includes some features proxyquire decide not to contain.

#API
* withRelativeResolve - to use stubs from some subset of paths
* withAliasResolve - to enable webpack alias name resolving
* setWebpackConfig - to set non-default webpack confug
* withIndirectUsage - to enable indirect usage of Proxyquire,
* overrideEntryPoint - to override entry point
  
#Entry point
how you normally use proxyquire?
```javascript
import proxyquire from 'proxyquire'
```
You use it `directly`. 
How you can use resolvequire?
```javascript
import proxyquire from 'proxyquire';
import { withAliasResolve } from 'resolvequire';
const myProxyquire = withAliasResolve(proxyquire);
```
3 lines in each file :( A bit ugly? Better to crete a little module, to hide some magic. 
But _you cannot use Proxyquire from other file_, or it will be unable to find target file to mock.
(just try)

How to use resolvequire?
```javascript
//test/proxyquire.js - lets create a little helper, in _different_ dirrectory
import Proxyquire from 'proxyquire/lib/proxyquire';  // we need Proxyquire base class
import { withAliasResolve, withIndirectUsage, overrideEntryPoint}  from 'resolvequire';

// then you will call proxyquire.load(filename) - it will try find filename in THIS dirrectory.
// THIS == this module, not source test, which requires this helper.
// one should override entry point.

// override entry point. Defaults to `parent` module -> our test.
overrideEntryPoint(); 

// create new proxyquire instance.
const withIndirect = withIndirectUsage(Proxyquire);
// add magics
const myProxyquire = withAliasResolve(proxyquire);
// export it
export default myProxyquire;
```
It is an open question - should I ship this helper, or not.              
              
# Stop! What is this for?
  

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

Next you have 100500 files, all having same deps, and you want your unit tests to mock every dependency they have.
```js
 var mockedModule = proxyquire.load('../moduleN.js',{
  './module1.js':{}, // will not passs
  './module2':{}, // will not pass
  'common/module3.js':{}, // will not pass
  'lib1':{}, // this will pass :P
  'stuff/module4.js':{}, // will not pass
 });
```
For you - all files have same dependencies. But all files lays in different locations, and `actual` requires will be different.

For mocking you can use [proxyquire](https://github.com/thlorenz/proxyquire/), but in every case you have to provide extract stubs to overwrite.
All your files can import modules in same maner, but in final code all requires will be relative to a file. 
Let me repeat - they all will be different. They all will require different setup for proxyquire.


```js
 var mockedModule = withRelativeResolve(proxyquire,['../moduleN.js',PROJECTROOT+'/core']).load({
   /*stubsInAnyForm*/
 })
```
And I will search all listed paths and calculate correct stubs.

Or
```js
 var mockedModule = withAliasResolve(proxyquire).load({
   'core/reducer:'....
 })
``` 
And I will calculate correct stubs using webpack aliases.
 
One command, and it will works.
 
How?

resolveQuire will try to find form of a fileName, that will be used by target file.
It will also make a twin for keys like 'module' -> 'module.js'. And nodejs require do.

It just work. Work absolutely not perfect, cos it is very hard to `invent` names of files requires.

__PS:__
PR-148, or https://github.com/theKashey/proxyquire works from opposite direction - it overloads proxyquire resolve logic, and tries to find a match between
known require and know stub key. No place for 'inventions'. But a good place for RegEx or straight logic. 
Might work more stable and in a better way. 