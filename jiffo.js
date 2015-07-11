// Jaiffa - Javascript Interactive Fiction/Adventure system.
// 2010-04-10 Felix Pleșoianu <felixp7@yahoo.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

// DSL functions.

function story(name) {
	jaiffa._STORY = new jaiffa.Story(name);
	if (!jaiffa._REGISTRY[name]) {
		jaiffa._REGISTRY[name] = {
			ROOMS: {},
			THINGS: {},
			ACTORS: {},
			EXITS: {},
			DOORS: {}
		};
	}
	return jaiffa._STORY;
}

function room(name, description) {
	if (jaiffa._REGISTRY[jaiffa._STORY.title].ROOMS[name]) {
		return jaiffa._REGISTRY[jaiffa._STORY.title].ROOMS[name];
	} else {
		var new_room = new jaiffa.Room(name, description);
		jaiffa._REGISTRY[jaiffa._STORY.title].ROOMS[name] = new_room;
		if (jaiffa._STORY.first_room == null) {
			jaiffa._STORY.first_room = new_room;
		}
		return new_room;
	}
}

function current(room) {
	if (room instanceof jaiffa.Room) {
		jaiffa._ROOM = room;
	}
	return jaiffa._ROOM;
}

function thing(name, description) {
	if (jaiffa._REGISTRY[jaiffa._STORY.title].THINGS[name]) {
		return jaiffa._REGISTRY[jaiffa._STORY.title].THINGS[name];
	} else {
		var new_thing = new jaiffa.Thing(name, description);
		jaiffa._REGISTRY[jaiffa._STORY.title].THINGS[name] = new_thing;
		if (jaiffa._ROOM != null) new_thing.move(jaiffa._ROOM);
		return new_thing;
	}
}

function actor(name, description) {
	if (jaiffa._REGISTRY[jaiffa._STORY.title].ACTORS[name]) {
		return jaiffa._REGISTRY[jaiffa._STORY.title].ACTORS[name];
	} else {
		var new_actor = new jaiffa.Actor(name, description);
		jaiffa._REGISTRY[jaiffa._STORY.title].ACTORS[name] = new_actor;
		if (jaiffa._ROOM != null) new_actor.move(jaiffa._ROOM);
		return new_actor;
	}
}

function exit(name, description) {
	if (jaiffa._REGISTRY[jaiffa._STORY.title].EXITS[name]) {
		return jaiffa._REGISTRY[jaiffa._STORY.title].EXITS[name];
	} else {
		var new_exit = new jaiffa.Exit(name, description);
		jaiffa._REGISTRY[jaiffa._STORY.title].EXITS[name] = new_exit;
		if (jaiffa._ROOM != null) new_exit.move(jaiffa._ROOM);
		return new_exit;
	}
}

function door(name, description) {
	if (jaiffa._REGISTRY[jaiffa._STORY.title].DOORS[name]) {
		return jaiffa._REGISTRY[jaiffa._STORY.title].DOORS[name];
	} else {
		var new_door = new jaiffa.Door(name, description);
		jaiffa._REGISTRY[jaiffa._STORY.title].DOORS[name] = new_door;
		//if (jaiffa._ROOM != null) new_door.move(jaiffa._ROOM);
		return new_door;
	}
}

function say(message) {
	jaiffa.say(message);
}


// Engine objects.

var jaiffa = {
	_STORY: null,
	_ROOM: null,
	_REGISTRY: {},
	
	output_buffer: [],
	say: function (message) {
		this.output_buffer.push(message);
	},
	
	list: function (objects) {
		if (objects && objects.length > 0)
			return objects.join(", ");
		else
			return "nothing of note";
	},
	
	find_in_scope: function (objects, word) {
		for (var i = 0; i < objects.length; i++) {
			if (!objects[i]) continue;
			var names = objects[i].names;
			for (var j = 0; j < names.length; j++) {
				if (word == names[j]) {
					return objects[i];
				}
			}
		}
		return null;
	},
	
	handle_action: function(target, action, actor) {
		if (!target[action]) return false;

		var objects = actor.scope();
		for (var i = 0; i < objects.length; i++) {
			if (objects[i] && objects[i].react_before) {
				objects[i].react_before(actor, action, target);
			}
		}

		var before = "before" + action;
		if (target[before]) {
			if (typeof (target[before]) == "function") {
				if (target[before](actor)) return true;
			} else {
				jaiffa.say(jaiffa.handle_value(target[before]));
				return true;
			}
		}
		
		if (typeof (target[action]) == "function") {
			target[action](actor);
		} else {
			jaiffa.say(jaiffa.handle_value(target[action]));
		}

		var after = "after" + action;
		if (target[after]) {
			if (typeof (target[after]) == "function") {
				target[after](actor);
			} else {
				jaiffa.say(jaiffa.handle_value(target[after]));
			}
		}

		var objects = actor.scope();
		for (var i = 0; i < objects.length; i++) {
			if (objects[i] && objects[i].react_after) {
				objects[i].react_after(actor, action, target);
			}
		}

		return true;
	},
	
	handle_value: function(value) {
		if (typeof (value) == "function") {
			return value();
		} else if (typeof (value) == "object") {
			if (value.constructor == Array) {
				return jaiffa.random_pick(value);
			} else {
				return value.toString();
			}
		} else {
			return value;
		}
	},
	
	random_pick: function(list) {
		var pick = Math.floor(Math.random() * list.length);
		return list[pick];
	}
};

jaiffa.Story = function (title) {
	this.title = title || "Untitled";
	this.author = "Anonymous";
	this.date = new Date(2010, 3, 10);
	this.tagline = "A text adventure";
	this.blurb = "";
	this.about = "See also: help, credits.";
	this.credits = "Based on the Jaiffa library by Felix Pleșoianu.";
	
	this.player = new jaiffa.Actor("yourself");
	this.player.altname("myself", "me");
	this.first_room = null;
};

jaiffa.Story.prototype = {
	start: function () {
		this.player.move(this.first_room);
		this.turns = 0;
		this.ended = false;
		jaiffa.say(this.blurb);
		jaiffa.say("<b>" + this.title + "</b><br>\n"
			+ this.tagline + " by " + this.author + "<br>\n"
			+ this.date.toString().split(" ").slice(0, 4).join(" ")
			+ "<br>(first time players please type 'help')");
		jaiffa.handle_action(this, "$look", this.player);
	},
	
	advance: function () {
		if (this.ended) return;
		
		var actors = jaiffa._REGISTRY[this.title].ACTORS;
		for (var i in actors) actors[i].act();

		var objects = this.player.scope();
		for (var i = 0; i < objects.length; i++) {
			if (objects[i] && objects[i].heremsg)
				jaiffa.say(jaiffa.handle_value(
					objects[i].heremsg));
		}
		
		this.turns++;
	},
	
	the_end: function (message) {
		this.ended = true;
		jaiffa.say("<b>*** " + message + " ***</b>");
	},
	
	// Intransitive verbs.
	$look: function (actor) {
		jaiffa.handle_action(actor.location, "$examine", actor);
	},
	
	$inventory: function (actor) {
		jaiffa.say("You are carrying: " + jaiffa.list(actor.children));
	},
	
	$wait: function (actor) {
		jaiffa.say("You wait. Time passes.");
	},
	
	$help: function (actor) {
		jaiffa.say("Direct the game with one- to three-word commands.");
		jaiffa.say("For example: 'look', 'pick up key', 'examine it',"
			+ " 'inventory', 'go north'. Some of these have"
			+ " abbreviations: 'l', 't key', 'x', 'i', 'n'.");
		jaiffa.say("But do try any other command that makes sense."
			+ " E.g. many objects have an 'use' verb.");
		jaiffa.say("See also: about, credits.");
	},
	
	$about: function (actor) {
		jaiffa.say(jaiffa.handle_value(this.about));
	},
	
	$credits: function (actor) {
		jaiffa.say(jaiffa.handle_value(this.credits));
	}
};
jaiffa.Story.prototype.$l = jaiffa.Story.prototype.$look;
jaiffa.Story.prototype.$i = jaiffa.Story.prototype.$inventory;
jaiffa.Story.prototype.$inv = jaiffa.Story.prototype.$inventory;

jaiffa.ObjectMixin = function() {
	this.toString = function () { return this.name; }
	
	// Divide object name into words for the benefit of the parser.
	this.parse_name = function (name) {
		var split_name = name.toLowerCase().split(/\s+/);
		// TODO: implement stop words.
		this.altname.apply(this, split_name);
	}
	
	// Give the object some synonyms for the benefit of the parser.
	this.altname = function () {
		if (!this.names) this.names = [];
		for (var i = 0; i < arguments.length; i++) {
			this.names.push(arguments[i]);
		}
		return this;
	}
	
	this.desc = function (description) {
		this.description = description;
		return this;
	}

	this.is = function () {
		for (var i = 0; i < arguments.length; i++) {
			this[arguments[i]] = true;
		}
		return this;
	}

	this.isnt = function () {
		for (var i = 0; i < arguments.length; i++) {
			this[arguments[i]] = false;
		}
		return this;
	}

	this.describe = function () {
		return this.description || "";
	}

	this.$examine = function (actor) {
		if (!actor.location.dark) {
			jaiffa.say(this.describe()
				|| "You see nothing special.");
		} else {
			jaiffa.say("It's too dark to see much.");
		}
	}
	this.$ex = this.$x = this.$l = this.$look = this.$look_at =
		function (actor) {
			jaiffa.handle_action(this, "$examine", actor); }
	
	this.$search = "You find nothing worth mentioning.";
	this.$look_in = function (actor) {
		jaiffa.handle_action(this, "$search", actor); }
};

jaiffa.ContainerMixin = function () {
	this.addChild = function (object) {
		if (!this.children) this.children = [];
		for (var i = 0; i < this.children.length; i++)
			if (this.children[i] == object)
				return;
		this.children.push(object);
	};
	
	this.removeChild = function (object) {
		if (!this.children) return;
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i] == object) {
				this.children.splice(i, 1);
				return;
			}
		}
	};
	
	this.has = function (object) {
		if (!this.children) return false;
		for (var i = 0; i < this.children.length; i++) {
			if (this.children[i] == object) {
				return true;
			}
		}
		return false;
	}
};

jaiffa.ThingMixin = function() {
	this.move = function (container) {
		if (this.location) this.location.removeChild(this);
		if (container) container.addChild(this);
		this.location = container;
		return this;
	}
	
	this.$take = function (actor) {
		if (this.location == actor) {
			jaiffa.say("You already have that.");
		} else if (this.location != actor.location) {
			jaiffa.say("I don't see that here.");
		} else if (this.portable) {
			this.move(actor);
			jaiffa.say("Taken.");
		} else {
			jaiffa.say("You can't.");
		}
	}
	this.$get = this.$grab = this.$pick_up = this.$t =
		function (actor) {
			jaiffa.handle_action(this, "$take", actor); }
	
	this.$drop = function (actor) {
		for (var i = 0; i < actor.children.length; i++) {
			if (actor.children[i] == this) {
				this.move(actor.location);
				jaiffa.say("Dropped.");
				return;
			}
		}
		say("You don't have that.");
	}
	this.$throw = function (actor) {
		jaiffa.handle_action(this, "$drop", actor);
	}
}

jaiffa.Room = function (name, description) {
	this.name = name;
	this.description = description;
	this.parse_name(this.name);
	this.exits = [];
};
jaiffa.ObjectMixin.apply(jaiffa.Room.prototype);
jaiffa.ContainerMixin.apply(jaiffa.Room.prototype);
jaiffa.Room.prototype.$examine = function (actor) {
	if (!actor.location.dark) {
		jaiffa.say(actor.location.name + "<br>\n"
			+ actor.location.describe());
		jaiffa.say("You see: "
			+ jaiffa.list(actor.location.children));
		jaiffa.say("Obvious exits: "
			+ jaiffa.list(actor.location.exits));
	} else {
		jaiffa.say("It's dark, you can't see much at all.");
	}
}

jaiffa.Exit = function (name, description) {
	this.name = name;
	this.description = description || "You see nothing special";
	this.parse_name(this.name);
	this.move = function (room) {
		room.exits.push(this);
		return this;
	};
}
jaiffa.Exit.prototype = {
	to: function (room) {
		this.target = room;
		return this;
	},
	
	via: function (door) {
		this.door = door;
		return this;
	},
	
	$go: function (actor) {
		if (this.door && this.door.locked) {
			if (actor.has(this.door.key)) {
				jaiffa.say("(first unlocking the door)");
				this.door.locked = false;
			} else {
				jaiffa.say("It's locked"
					+ " and you don't have the key.");
				return;
			}
		}
		if (this.door && this.door.travelmsg) {
			jaiffa.say(this.door.travelmsg);
		} else if (this.travelmsg) {
			jaiffa.say(this.travelmsg);
		}
		actor.move(this.target);
		jaiffa.handle_action(actor.location, "$examine", actor);
	},
	
	$lock: function (actor) {
		if (this.door) {
			if (actor.has(this.door.key)) {
				if (this.locked) {
					jaiffa.say("Already locked.");
				} else {
					jaiffa.say("You lock the door.");
					this.door.locked = true;
				}
			} else {
				jaiffa.say("You don't have the key.");
			}
		} else {
			jaiffa.say("There's nothing to lock");
		}
	},
	
	$unlock: function (actor) {
		if (this.door) {
			if (actor.has(this.door.key)) {
				if (!this.locked) {
					jaiffa.say("Already unlocked.");
				} else {
					jaiffa.say("You unlock the door.");
					this.door.locked = false;
				}
			} else {
				jaiffa.say("You don't have the key.");
			}
		} else {
			jaiffa.say("There's nothing to unlock");
		}
	},
	
	$open: function(actor) { jaiffa.say("No need."); },
	$close: function(actor) { jaiffa.say("No need."); }
};
jaiffa.ObjectMixin.apply(jaiffa.Exit.prototype);
jaiffa.ThingMixin.apply(jaiffa.Exit.prototype);

jaiffa.Door = function (name, description) {
	this.name = name;
	this.description = description || "You see nothing special";
};
jaiffa.ObjectMixin.apply(jaiffa.Door.prototype);
jaiffa.ThingMixin.apply(jaiffa.Door.prototype);

jaiffa.Actor = function (name, description) {
	this.name = name;
	this.parse_name(this.name);
	this.description = description || "You see nothing special";
	this.portable = true;
}
jaiffa.Actor.prototype = {
	act: function () { },
	
	scope: function () {
		return [].concat(
			this.location,
			this.location.children,
			this.location.exits,
			this.children);
	},
	
	$talk_to: function (actor) {
		jaiffa.say(this.name + " doesn't seem interested in talking.");
	}
}
jaiffa.ObjectMixin.apply(jaiffa.Actor.prototype);
jaiffa.ThingMixin.apply(jaiffa.Actor.prototype);
jaiffa.ContainerMixin.apply(jaiffa.Actor.prototype);

jaiffa.Thing = function (name, description) {
	this.name = name;
	this.description = description || "You see nothing special";
	this.parse_name(this.name);
}
jaiffa.ObjectMixin.apply(jaiffa.Thing.prototype);
jaiffa.ThingMixin.apply(jaiffa.Thing.prototype);

jaiffa.VerbObjectParser = function (story) {
	this.story = story;
	this.it = undefined;
}

jaiffa.VerbObjectParser.prototype = {
	parse: function (command) {
		jaiffa.say(this.story.turns + "> " + command);
		if (this.story.ended) {
			jaiffa.say("Sorry, the story has ended.");
			return;
		}
		var words = command.split(" ");
		var player = this.story.player;
		if (words.length == 0) {
			jaiffa.say("I beg your pardon?");
		} else if (words.length == 1 || words.length > 3) {
			var verb = words.join("_");
			var action = "$" + verb;
			if (jaiffa.handle_action(this.story, action, player))
				return;
			else if (!this.handle_exit(verb, player))
				say("I don't know how.");
		} else if (words.length == 3) {
			var verb = words.join("_");
			var action = "$" + verb;
			if (jaiffa.handle_action(this.story, action, player)) {
				return;
			} else {
				var verb = words[0] + "_" + words[1];
				var action = "$" + verb;
				var target = this.pick_target(words.slice(2));
				this.handle_sentence(target, verb, player);
			}
		} else if (words.length == 2) {
			var verb = words.join("_");
			var action = "$" + verb;
			if (jaiffa.handle_action(this.story, action, player)) {
				return;
			} else {
				verb = words[0];
				var target = this.pick_target(words.slice(1));
				this.handle_sentence(target, verb, player);
			}
		} else {
			var verb = words[0] + "_" + words[1];
			var target = this.pick_target(words[2]);
			this.handle_sentence(target, verb, player);
		}
	},
	
	pick_target: function (nouns) {
		if (nouns[0] == "it") {
			return this.it;
		} else {
			var objects = this.story.player.scope();
			return jaiffa.find_in_scope(objects, nouns[0]);
		}
	},
	
	handle_exit: function (word, actor) {
		var exits = actor.location.exits;
		var exit = jaiffa.find_in_scope(exits, word);
		if (exit != null) {
			jaiffa.handle_action(exit, "$go", actor);
			return true;
		} else {
			return false;
		}
	},
	
	handle_sentence: function (target, verb, actor) {
		var action = "$" + verb;
		if (target === undefined) {
			jaiffa.say("I don't know what you mean by"
				+ " 'it' right now.");
		} else if (target === null) {
			jaiffa.say("I don't see that here.");
		} else if (target[action] == null) {
			jaiffa.say("I don't know how to "
				+ verb + " the " + target + ".");
			this.it = target;
		} else {
			jaiffa.handle_action(target, action, actor);
			this.it = target;
		}
	}
}
