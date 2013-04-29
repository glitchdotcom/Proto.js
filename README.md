Proto.js - Prototypical Inheritance Embraced
============================================
Prototypical inheritence in JavaScript is actually kind of cool, but in addition to
deviating from the inheritance most people are used to, it's annoyingly hard to use
(``Object.create`` wasn't even added until ES5, and even that is a little unfriendly).
``Proto.js`` embraces JavaScripts prototypical inheritance and makes it easy to create
new objects that extend a prototype using a concise syntax enabled by JavaScript's
object literals.

.create()
---------
``create`` is how you create new objects that extend other objects:

	// indicate that an object is a prototype with StudlyCaps
	var Person = Proto.create({
		greet: function() {
			return "Hello " + this.name + "!".
		}
	});
	
	var joe = Person.create({name: "Joe"});
	joe.greet() --> "Hello Joe!"

.extend()
---------
``Proto.js`` objects are re-openable, and ``extend`` allows you to attach methods and
objects to existing objects just like during ``create``:

	Person.extend({
		greetLoudly: function() {
			return this.greet().toUpperCase();
		}
	});
	
	joe.greetLoudly() --> "HELLO JOE!";


._super()
---------
``Proto.js`` object make it possible to override existing methods, but still call them:

	var LoudPerson = Person.create({
		greet: function() {
			// Lets us search the prototype chain starting above the object we pass in.
			var message = this._super(LoudPerson).greet();
			return message.toUpperCase();
		}
	});
	
	var jill = LoudPerson.create({name: "Jill"});
	jill.greet() --> "HELLO JILL!";

Never write $.proxy again!
--------------------------
Methods on ``Proto.js`` objects are bound by default (you can still get at the unbound methods in ``__methods__`` if
you need to):

	var f = joe.greet;
	f() --> "Hello Joe!"
	
	var g = joe.__methods__.greet;
	g() --> "Hello undefined!"

	
License
-------
Licensed under the [Apache Public License v2.0](http://www.apache.org/licenses/LICENSE-2.0)
