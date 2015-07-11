// Demo of Jiffo (formerly for Jaiffa).
// 2010-05-18 Felix Pleșoianu <felixp7@yahoo.com>
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

s = story("Catch that cat");
s.author = "Felix Pleşoianu";
s.date = new Date(2010, 4, 18);
s.tagline = "An interactive tech demo";
s.blurb = "Ugh. Monday morning. You're still not recovered after the party"
	+ " two days ago, and you have an SMS from your wife: 'Will stay"
	+ " with mom for one more day. You take the cat to the vet.' Meh.";
s.about = "Catch that cat is the official tech demo for the Jaiffa library.";
s.credits = "Alpha testers: a hovering egg, a Sitka deer and a batty blue bat."
	+ "\nBeta testers: Abbey Spracklin and Nightwrath.";
	
s.player.description =
	"You look at your hairy arms, dirty T-shirt and worn-out jeans,"
	+ " and wiggle your toes in the cheap Chinese sandals. Sigh.";

current(room(
	"Living room",
	"This is your one-room apartment in eastern Bucharest."));
tv = thing("TV set", "Unfortunately, it's broken. Again.");
thing("couch").$use = thing("couch").$sit_on =
	"You rest on the couch for a few moments. Aah, comfy!";
thing("coffee table");
thing("remote control").is("portable");
bottle = thing("beer bottle", "It's empty and sad.").is("portable");
bottle.$drink = bottle.$use =
	"You turn the bottle upside-down. It's really empty!";
mitzi = actor("Mitzi", "She's your black and white cat, young and energetic.")
	.altname("cat", "kitty", "kitten");
mitzi.$catch = mitzi.$take = [
	"Mitzi deftly escapes your grasp.",
	"Mitzi runs between your feet.",
	"You catch Mitzi, but she wiggles until you drop her."];
mitzi.$wrestle = mitzi.$squeeze = mitzi.$brush =
	"You'd have to hold her first.";
mitzi.$eat = "Ew! Besides, your wife would kill you.";
mitzi.$lick = "She's the cat, not you. Don't mix things up.";
mitzi.$call = "Yeah, good luck with that.";
mitzi.$pet = mitzi.$fluff = mitzi.$touch =
	"Mitzi purrs and pushes into your hand.";
mitzi.$poke = "Mitzi nips you, and shows off her claws for good measure.";
mitzi.heremsg = [
	"Mitzi scampers about.",
	"Mitzi pounces a dust bunny.",
	"Mitzi chases her own tail.",
	"Mitzi races across the floor.",
	"Mitzi starts licking herself furiously."];
mitzi.act = function() {
	if (this.location == room("Basement")) {
		if (this.location.dark) {
			this.heremsg =
				"A pair of shining eyes stare at you"
					+ " from the darkness.";
		} else {
			this.heremsg =
				"Mitzi peers at you from behind"
					+ " some water pipes.";
		}
	} else if (!this.location) {
		var loc = thing("cat carrier").location;
		if (loc == s.player || loc == s.player.location) {
			say("Mitzi shuffles inside her carrier.");
		}
	} else if (s.player.location != this.location) {
		this.move(s.player.location);
		say("Mitzi scampers after you.");
		if (this.location == room("Ground floor")) {
			this.move(room("Basement"));
			this.heremsg = undefined;
			this.$pet = this.$take =
				"You can't quite reach her right now.";
			say("Mitzi squeezes through a hole in the door"
				+ " and into the basement.");
		} else if (thing("broom").location == s.player
				|| thing("broom").location == this.location) {
			say("Mitzi gives the broom a wide berth.");
		}
	}
}
exit("North to balcony").altname("n").to(room("Balcony"));
exit("Northwest to kitchen").altname("nw").to(room("Kitchen"));
exit("West to hallway").altname("w", "out").to(room("Hallway"));

tv.$turn_on = tv.$switch_on = tv.$use = tv.description;
tv.$turn_off = tv.$switch_off = "It's already very much off.";
tv.$watch = function() {
	say("You look at the blank TV screen for a while.");
	say("It's actually better than most channels.");
};
tv.$fix = tv.$repair =
	"You tried that with the old TV. That's why you have a new one."
	+ "\nPlus, you'd need the right tools.";
thing("remote control").$use =
	"Click! Click! The batteries must be dry. No wait, TV's broken.";
bottle.$fill = function(actor) {
	if (actor.location == room("Bathroom")) {
		say("The faucet gives off a gargling sound, but no water.");
	} else if (actor.location == room("Kitchen")) {
		say("The faucet gives off a gargling sound, but no water.");
	} else {
		say("There's no source of water here.");
		say("Or beer, for that matter.");
	}
};
bottle.$break = "On second thought, you need to return it intact.";
bottle.$open = bottle.$close = "Too late, alas!";

current(room("Balcony")
	.desc("From the 11th floor you have a wonderful urban vista."
		+ " Endless rows of apartment buildings everywhere you look."));
broom = thing("broom", "An ordinary broom, and Mitzi's nemesis.")
	.is("portable");
exit("South to living room").altname("s", "out").to(room("Living room"));

room("Balcony").$jump_off = room("Balcony").$jump_from =
	"Nooooo! Don't jump! Life is beautiful! And you have a game to win!";
broom.$use = "Aww! But you just swept the floors yesterday.";
broom.$wave = broom.$shake = broom.$show = function (actor) {
	if (mitzi.location != actor.location) {
		say("Who are you trying to impress?");
	} else if (mitzi.location.dark) {
		say("Mitzi ignores the broom, believing you can't see her.");
	} else if (thing("cat carrier").location == actor) {
		mitzi.move(null);
		say('Mitzi waits until you put down her carrier, and climbs in.');
	} else if (thing("cat carrier").location == actor.location) {
		mitzi.move(null);
		say("Mitzi climbs into the cat carrier timidly.");
	} else {
		say("Mitzi stops for a moment and looks for her carrier.");
	}
}

k = current(room("Kitchen",
	"Stacks of dirty dishes raise from every possible surface."));
crate = thing("beer crate",
	"A 12-slot beer crate with 11 empty bottles in it.")
		.is("portable");
crate.after$examine = "The last slot is broken and can't hold a bottle.";
crate.$empty = "Better not, you'll need to return it and the bottles.";
exit("Out to living room").altname("se", "o").to(room("Living room"));
k.$clean = "The kitchen is such a mess, you wouldn't know where to start.";

current(room("Hallway"));
exit("North to bathroom").altname("n").to(room("Bathroom"));
exit("East to living room").altname("e").to(room("Living room"));
exit("West to the outside").altname("w")
	.to(room("11th floor"))
		.via(door("outside door"));

door("outside door").is("locked").key = thing("keychain");
key = thing("keychain").is("portable").move(null); // Remove from game for now.
key.altname("key", "keys", "chain").$use = "Try unlocking a door.";
thing("cellphone").altname("mobile", "phone").move(null)
	.$use = "You try to call the vet and reschedule the appointment,"
		+ " but no dice. They're booked solid.";
s.$call_vet = thing("cellphone").$use;
s.$call_wife = "Sure, so she can chew you out.";

current(room("Bathroom",
	"A dim lightbulb, peeling paint, water on the floor. Home sweet home."));
laundry = thing("Dirty laundry").altname("clothes").is("portable")
	.desc("These are the clothes you've been wearing all weekend.");
laundry.after$examine = laundry.after$take = laundry.after$drop =
	"Something rattles in the pile of laundry.";
laundry.$wear = "Ew! They smell!";
laundry.$burn = "You fumble for a lighter. Oh wait, you don't smoke.";
laundry.$search = laundry.$shake = laundry.$poke = laundry.$open =
function (actor) {
	if (!thing("keychain").location) {
		thing("keychain").move(actor);
		thing("cellphone").move(actor);
		say("Aha! There's your keys and your cellphone. Pocketed.");
		laundry.after$examine = laundry.after$take =
			laundry.after$drop = undefined;
	} else {
		say("There's nothing else in there.");
	}
};
exit("South to hallway").altname("s", "out", "o").to(room("Hallway"));

current(room("11th floor"));
exit("East to your apartment").altname("e")
	.to(room("Hallway"))
		.via(door("outside door"));	
exit("Down the stairs").altname("d").to(room("Ground floor"))
	.travelmsg = "You trot down the 11 flights of stairs. Sigh.";
	
lift = thing("elevator");
lift.$call = lift.$use = function (actor) {
	say("You push the elevator's call button repeatedly.");
	say("After a while, nothing seems to happen. How typical.");
}
lift.react_before = function (actor, action, target) {
	if (action != "$go")
		return;
	else if (target == exit("Down the stairs"))
		this.move(room("Ground floor"));
	else if (target == exit("Up the stairs"))
		this.move(room("11th floor"));
}

current(room("Ground floor"));
light = thing("light switch", "It's hanging by a wire.");
exit("Up the stairs").altname("u").to(room("11th floor"))
	.travelmsg = "You trot up the 11 flights of stairs. Sigh.";	
exit("Down to basement").altname("d")
	.to(room("Basement"))
		.via(door("basement door"));
exit("Out of the building").altname("outside", "o", "exit", "leave")
	.to(room("Outside your apartment building"));

door("basement door").is("locked").key = thing("keychain");
light.$fix = light.$repair = function (actor) {
	if (this.working) {
		say("Already fixed.");
	} else if (actor.has(thing("toolkit"))) {
		this.working = true;
		this.desc("A freshly repaired,"
			+ " but otherwise ordinary light switch.");
		say("You set to work, grumbling and mumbling.");
		say("There, fixed. Not for the first time, either.");
	} else {
		say("You need tools for that.");
	}
}
light.$flip = light.$use = function (actor) {
	if (this.working) {
		room("Basement").dark = !room("Basement").dark;
		say("You flip the switch.");
	} else {
		say("The light switch is in no condition to be flipped.");
	}
}

current(room("Basement")).is("dark");
room("Basement").desc(
	"A vast room, silent and damp, subdivided by flimsy plywood walls."
	+ " Ridiculously, big padlocks adorn stall doors a kid could break.");
exit("Up to ground floor").altname("u", "out", "o")
	.to(room("Ground floor"))
		.via(door("basement door"));
	
current(room("Outside your apartment building").altname("street").desc(
	"A narrow backstreet meanders among 12-story apartment buildings."));
thing("trees").altname("tree");
thing("grass");
thing("lamp posts").altname("post", "streetlight");
car = thing("your car", "A second-hand Dacia 1310, almost an antique now.")
	.altname("tire", "trunk", "window");
car.after$examine = "It's been sitting in the sun, so now it's hot and..."
	+ " Oh no, you have a flat tire.";
car.$fix = car.$change = car.$repair = function (actor) {
	if (this.working) {
		say("You've already changed the tire.");
	} else if (actor.has(toolkit)) {
		this.working = true;
		this.after$examine =
			"It's been sitting in the sun, so now it's hot.";
		say("You set to work changing the tire, sweating heavily.");
		say("It seems to take much longer than it actually does.");
	} else {
		"You need tools for that.";
	}
}
car.$drive = car.$get_in = car.$enter = car.$use = function (actor) {
	if (!this.working) {
		say("Your car isn't going anywhere with a flat tire.");
	} else if (mitzi.location) {
		say("No point in going to the vet without Mitzi.");
	} else {
		say("You load Mitzi's carrier in the car, and drive off to see"
			+ " the vet. About halfway there, you run out of gas.");
		s.the_end("You have won!");
	}
}
car.$open = car.$close = car.$lock = car.$unlock = function (actor) {
	if (actor.has(key)) {
		say("You play with the remote and double-check the doors."
			+ " Everything seems fine.");
	} else {
		say("You don't have the keys.");
	}
}
car.$search = function (actor) {
	if (thing("cat carrier").location == null) {
		thing("cat carrier").move(actor);
		say("You search the trunk and come up with"
			+ " Mitzi's cat carrier. Ah, there it was!");
	} else {
		say("You look through the trunk, but find nothing useful.");
	}
}
exit("Building entrance").altname("enter", "in")
	.to(room("Ground floor"));
exit("Corner store").altname("south", "s")
	.to(room("Corner store")).travelmsg = "You cross the street.";
	
thing("cat carrier").is("portable").move(null);
thing("cat carrier").after$examine = function(actor) {
	if (!mitzi.location) say("Mitzi peers back at you from inside.");
}

current(room("Corner store").desc(
	"Actually a converted ground floor apartment, but it does the job."));
thing("shelves");
thing("counter");
thing("cash register");
gro = thing("groceries");
gro.$take = gro.$buy = "You don't need anything right now.";
neighbor = actor("Mr. Petrescu",
	"Your portly, balding, middle-aged neighbor and store owner.")
		.altname("neighbor", "man");
neighbor.$take =
	"Mr. Petrescu would not appreciate that. Besides, he's heavy.";
neighbor.$talk_to = "You chat amiably with Mr. Petrescu about nothing.";
neighbor.heremsg = [
	"Mr. Petrescu idly rearranges some bottles on the shelves.",
	"Mr. Petrescu updates a few price labels.",
	"Mr. Petrescu taps his foot lightly and hums a little song.",
	"Mr. Petrescu fumbles under the counter.",
	"Mr. Petrescu fiddles with the cash register."];
neighbor.react_after = function (actor, action, target) {
	if (action == "$examine" && target == thing("toolkit")) {
		say('Mr. Petrescu beams. "Like my new toolkit, neighbor?"');
	} else if (action == "$go" && target == exit("Corner shop")) {
		say('Mr. Petrescu says,'
			+ ' "Hello, neighbor. Can I get you anything?"');
	}
}
toolkit = thing("toolkit",
	"A big portable toolkit, of the kind they sell for car repairs.")
		.altname("tools", "kit").is("portable");
toolkit.$borrow = toolkit.$get; // 'borrow' redirects properly no matter what.
toolkit.$request = toolkit.$get;
toolkit.$buy = '"Sorry, that\'s not for sale," says Mr. Petrescu.';
toolkit.$use = "You probably want to fix something.";
exit("Out of the shop").altname("outside", "o", "exit", "leave")
	.to(room("Outside your apartment building"));

bottle.after$drop = function (actor) {
	if (this.location == room("Corner shop")) {
		this.move(null);
		say('You put the bottle on the counter.'
			+ ' "I believe you wanted this back?"');
		say('Mr. Petrescu takes it in the back.'
			+ '"Yes, indeed. Thank you, neighbor."');
	}
}
thing("beer crate").after$drop = function (actor) {
	if (this.location == room("Corner shop")) {
		this.move(null);
		say('You carefully set the crate down by the counter.'
			+ ' "I believe you wanted this back?"');
		say('Mr. Petrescu takes it in the back.'
			+ '"Yes, indeed. Thank you, neighbor."');
	}
}
toolkit.before$take = function (actor) {
	if (this.borrowed) return false; // Don't bother playing the dialogue
					// once the toolkit has been moved.
	if (!this.asked_about) {
		this.asked_about = true;
		say('"Say, neighbor," you ask, "can I borrow your tools?"');
	}
	
	if (bottle.location == null && crate.location == null) {
		this.borrowed = true;
		say('Mr. Petrescu gestures towards the toolkit.'
			+ '"Help yourself. Just take care of it, will you?"');
		return false;
	} else {
		say('"Not so fast," says Mr. Petrescu,'
			+ ' "Where is my beer crate?'
			+ ' I need to return all the empty bottles."');
		return true;
	}
}

s.$drive = "What do you want to drive?";
