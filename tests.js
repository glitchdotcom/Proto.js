var fb = fb || {};

$(function () {
    "use strict";

    module("Proto.js");

	function fmt(tmpl) {
		var dict = arguments[arguments.length - 1];
		var args = Array.prototype.slice.call(arguments, 1);
		return tmpl.replace(/{([^}]+)}/g, function(_, key) {
			var idx = parseInt(key, 10);
			if (isNaN(idx)) {
				return dict[key];
			}
			return args[idx];	
		});
	}

    var Person = Proto.create({
        hello: function () {
            return fmt("Hello my name is {name}.", this);
        },
        say: function (name) {
            return fmt("Hello {0}!", name);
        },
        sayItWithFeeling: function (name, attitude) {
            return fmt("Hello {0} it is a {1} day!", name, attitude);
        },
        get fullName() {
            return fmt("{0} {1}", this.name, this.lastName);
        },
        set fullName(name) {
            var names = name.split(" ");
            this.name = names[0];
            this.lastName = names[1];
        }
    });

    var ClassyPerson = Person.create({
        say: function (name) {
            return "Indubitably.";
        },
        get fullName() {
            return fmt("{1}, {0} {1}", this.name, this.lastName);
        }
    });

    var QuietPerson = Person.create({
        hello: function () {
            var msg = this._super(QuietPerson).hello();
            return msg.toLowerCase();
        }
    });

    var LoudPerson = QuietPerson.create({
        hello: function () {
            var msg = this._super(LoudPerson).hello();
            return msg.toUpperCase();
        },
        sayItWithFeeling: function (name, attitude) {
            var msg = this._super(LoudPerson).sayItWithFeeling(name, attitude);
            return msg.toUpperCase();
        }
    });

    var OpinonatedPerson = Person.create({
        create: function (name) {
            return this._super(OpinonatedPerson).create({ name: name });
        }
    });

    test("Proto objects", function () {
        equal(
            Person.say("world"), "Hello world!",
            "can have useful methods"
        );

        equal(
            ClassyPerson.say("world"), "Indubitably.",
            "can override inherited methods"
        );

        var person = Person.create({ name: "Alan" });
        equal(
            person.hello(), "Hello my name is Alan.",
            "methods can referance instance data"
        );

        equal(
            person.hello.apply(null), "Hello my name is Alan.",
            "methods are bound when they're created"
        );

        var quiet = QuietPerson.create({ name: "Alan" });
        equal(
            quiet.hello(), "hello my name is alan.",
            "overrides can access overriden methods using _super()"
        );

        var loud = LoudPerson.create({ name: "Alan" });
        equal(
            loud.hello(), "HELLO MY NAME IS ALAN.",
            "_super() chain goes all the way to the root"
        );

        equal(
            loud.sayItWithFeeling("world", "wonderful"),
            "HELLO WORLD IT IS A WONDERFUL DAY!",
            "_super() lets you pass along arguments"
        );

        LoudPerson.extend({
            say: function (name) {
                var msg = this._super(LoudPerson).say(name);
                return msg.toUpperCase();
            }
        });

        var evenLouder = LoudPerson.create();
        equal(
            evenLouder.say("world"), "HELLO WORLD!",
            "are open an can be extended with extend()"
        );

        equal(
            loud.say("world"), "Hello world!",
            "but existing objects' methods are already bound"
        );

        var anon = OpinonatedPerson.create("Anon Y. Mouse");
        equal(
            anon.hello(), "Hello my name is Anon Y. Mouse.",
            "can override create() to control object construction"
        );

        var fullNamed = LoudPerson.create({name: "John", lastName: "Doe"});
        equal(
            fullNamed.fullName, "John Doe",
            "accessor properties work and bind to the bottom-most 'this' object"
        );

        var jamesBond = ClassyPerson.create({name: "James", lastName: "Bond"});
        equal(
            jamesBond.fullName, "Bond, James Bond",
            "you can override accessors... but don't call _super()"
        );

        var noName = Person.create({});
        noName.fullName = "John Doe";
        equal(
            fmt("{name}:{lastName}", noName), "John:Doe",
            "setters work too"
        );
    });
});
