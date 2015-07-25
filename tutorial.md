# Jiffo Tutorial by David A. Wheeler


# Introduction

"Jiffo" is a framework for creating parser-based interactive fiction (IF)
that is open source software (OSS) and built on Javascript.
If you want to create IF, you may have found what you want!
But first, let's define those key terms:

*   Parser-based interactive fiction (IF) is "software simulating an environment in which players use text commands to control characters and influence the environment." per Montfort.  The software is called the "story" or "game".  These are diffferent from choose your own adventure (CYOA) systems, because these games can simulate an environment (e.g., where objects are placed).
*   Open source software (OSS) is software where users have the freedom to run, copy, (re)distribute, study, change and improve the software for any purpose and without royalty payments.  Jiffo is released under the MIT license.
*   Javascript is the widely-used language implemented by all major web browsers and defined by the formal "ECMAscript" standard.

A key advantage of Jiffo is that it's OSS.
Most IF development systems are *not* OSS; non-OSS systems for IF include
Inform 7, TADS (2 or 3), ADRIFT, and JIFFEE
(at least at the time of this writing).
In a non-OSS system you have a risk that the original developers will
stop maintaining it (a big risk if the software is developed as a hobby)
or develop it in a direction you don't want (since you can't go
a different way).
Only Inform 6 is a widely-used IF development system.

Another key advantage of Jiffo stems from Javascript.
Most IF stories are developed
for specialized formats such as Z-code
(originally developed by Infocom) or Glulx.
However, this requires that the user find a program for these formats.
Programs like Parchment implement these older formats through Javascript,
but that creates an extra layer of complexity.
Also, most IF programming languages are only known
to a few IF developers; relatively few people can work to improve
Inform 7 or TADS.
All of this is unnecessary today.
We now have a single language (Javascript) that can be securely and portably
executed on a variety of systems.
By using Javascript directly, IF developers can immediately have
access to all the capabilities and libraries of Javascript.
The documentation and help for millions of Javascript developers becomes
immediately useful, and developers
can build on a widely-used and supported standard.
Some people write IF as a way to learn how to program; in that case,
it makes more sense to learn to use a language you can directly use for
other purposes.
Players can use the IF in a much
easier way (they can just view a page with their web browser!).
Javascript is designed to be easy to get started, and because it is extremely
dynamic it can be a good language for IF.

For many IF developers, Jiffo may be what you're looking for.  That said, Jiffo is not for everyone:

*   Jiffo is a very new system, so it lacks a large number of capabilities and conveniences that older systems include by default.  That said, since it's OSS and in standard Javascript, it's easy to add those things, and we hope that people will contribute improvements to give it similar capabilities.
*   Jiffo uses Javascript directly.  If you instead want to use a programming language that looks like a Natural Language, another tool like Inform 7 would be a better fit.
*   Jiffo is intended for creating parser-based interactive fiction (IF).  If you're trying to create something else, such as a 3D graphical game, Jiffo is probably not the right framework.

Jiffo is derived from Jaiffa
(the Javascript Interactive Fiction/Adventure system) by
Felix Ple&#537;oianu.
Jaiffa focuses on being small, simple, and easy to understand,
so if you want a small system to read and understand, Jaiffa may be
the better choice.
Jiffo, in contrast, intends to be full-featured, and thus Jiffo is a better
match if you're trying to create a new IF story/game.
Jiffo is basically a "friendly fork" of Jaiffo; we are very grateful to
Felix Ple&#537;oianu for his pioneering work.

Since Jiffo is new, many changes are anticipated.
However, that's not a problem.
Just download a specific version of Jiffo and include it with your
story/game, and you're all set... nothing will change unless you want it to.
Feedback on what should change would be welcome, though.

Jiffo stands for
"Javascript Interactive Fiction Framework that's Open Source Software".
But Jiffo is a lot easier to pronounce.


# Getting started

To create a game, you need two files, GAME.html and GAME.js,
where GAME is the name of your game.
GAME.js is the heart of it; this is the file that you will
edit to implement your game.
The GAME.html file creates the user interface shell around the game;
you can quickly create GAME.html that from a template.
You will also need a CSS file which controls display formats
like font sizes; most people will just use the provided file default.css.
Finally, you need the actual library that implements jiffo, jiffo.js,
which we provide.

To start,
just copy the "catch-that-cat.html" file to GAME.html
(changing GAME to the name of your game), and edit the GAME.html file
with any text editor.
Look for "catch-that-cat.js" and replace that with "GAME.js"
(so that it opens your game instead), and save.

Now in any text editor start editing the file GAME.js
(again, replacing GAME with the name of your game).
You should first add license information and information
about the story.  You should also add a description of the player.
Here's an example, just change what you fill in:

    // GAME - SHORT DESCRIPTION
    // DATE - NAMES OF AUTHORS
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
    s.author = "Felix Ple&#537;oianu";
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

# Describing the static world

Jiffo works by having you declare what exists in the world
and their properties.
Most of those properties will be simple static (fixed) values.
That means that by just making a few simple statements
you can create an environment where the player can move around, examine
things, pick up and drop things, and so on.
Some of those properties may be functions that actively perform some task,
instead of being simple static values;
we'll get that later once we understand how static properties work.

First, we have be able to create constructs in our simulated world.
The key types of constructs that can be created are:

*   room (a location a player can be in)
*   actor (something that may actively perform activities)
*   thing (something that may somewhere but isn't active like an actor)
*   exit (a connection from one place to another)
*   door (something that may be on an exit).

To create a construct, you basically call a function with the
name of the type to be created along with two parameters:
its name and its (long) description.
These two parameters are normally strings sinde
enclosed in double quotes, single quotes, or backquotes.
The second parameter is actually optional, though it's a good idea.
Let's show an example (examples here are based on the demo
game "catch that cat"):

    room("Living room", "A shabby living room in a one-room apartment.");

The command ends a semicolon.
In Javascript semicolons are (normally) optional,
but many recommend using it, so we'll use it here.

You can set parameters on something you create.
Many parameters are true/false parameters, and there's an easy way
to set them to be true or false.
For example, if the "portable" true/false parameter is true then the relevant
thing can be picked up (normally things cannot be picked up).
You can use the "is" method to set true/false parameters:

    thing("broom", "An ordinary broom.").is("portable");

You can actually set multiple true/false parameters using *is* -
just list them as comma-separated values inside "is".
You can also use "isnt" to set parameters as being false.

Ah, but where was the broom created?
Every thing that you create has a "location" property which records
where that particular thing is located (e.g., is "inside of" or "held by").
By default, whenever you create a new room,
that room becomes the "current location".
Newly-created things start off by being put inside the "current location".

You can use the "move" method to move something to somewhere else.
Of course, this raises a question: How can you refer to something
you've already created?
One way to give a reference is
to give the type and just the first (name) parameter.
If you don't want it to be anywhere, move it to the special location "null".
Here we'll create the broom, make it portable, and
then forceably move it into the Living room (we'll see in a moment
how we can make this shorter):

    thing("broom", "An ordinary broom.").is("portable")
        .move(room("Living room"));

To set a property other than true/false properties,
you can use Javascript assignment statements: state the value to set,
"=" (for assignment), and the new value.
You can do this to set the location, but "move" is easier.
You can remove a property from some thing by setting it to be "undefined".
An unset value will revert to its default value, and if there is no
default, the  final value is undefined.
Here's an example of how to set values:

    thing("broom").magic_word = "xyzzy";

Referring to something as room("Living room") could get lengthy.
Also, you have to be careful: you have to match upper/lower case exactly
when you refer to names.
Thus, if refer to something often,
it may be easier to store a reference in a variable like this:

    tv = thing("TV set", "Unfortunately, it's broken. Again.");
    lr = room("Living room");

From then on, you can use the value <tt>tv</tt> instead of
<tt>thing("TV set")</tt> and <tt>lr</tt> for the living room.
For example, you can now move the tv into the living room this way:
    tv.move(lr);

Users may user many different names to refer to something.
The "altname" method accepts one or more parameters listing alternative
names.  Here's an example:

    mitzi = actor("Mitzi",
                  "She's your black and white cat, young and energetic.")
	       .altname("cat", "kitty", "kitten");

You probably want to move from one place to another.
The "exit" function lets you create exits; you can set alternate names,
where they go to, and possibly a door that might block your patch.
Here's an example:

    exit("East to your apartment").altname("e")
        .to(room("Hallway"))
        .via(door("outside door"));    

We might want to lock the door, and we could also set a "key" value that
refers to the thing that can unlock the door.  Locked doors
have the "locked" property set to true.  Here's an example:

    door("outside door").is("locked").key = thing("keychain");

# Making the world active

So far we've created a static world; now let's see how
can we change how the world responds to events.
Commands are converted into properties that begin with the dollar sign $,
and there's an attempt to apply them to what is local to the player.
If the value of a command is a string, that string is displayed as the result.
For example, this will cause "pet mitzi" to respond with something specific:

    mitzi.$pet = "Mitzi purrs and pushes into your hand.";

You can make the responses vary by creating a list of options;
just put them between square brakets and separate the options with
commas, like this:
    mitzi.$take = [
	"Mitzi deftly escapes your grasp.",
	"Mitzi runs between your feet.",
	"You catch Mitzi, but she wiggles until you drop her."];

Simple multi-word commands use underscores, e.g.:

    tv.$turn_on = tv.$switch_on = tv.$use = tv.description;

If the player is with another actor the "heremsg" will be used on each turn.
The same rules apply, e.g.:

    mitzi.heremsg = [
        "Mitzi scampers about.",
        "Mitzi pounces a dust bunny.",
        "Mitzi chases her own tail.",
        "Mitzi races across the floor.",
        "Mitzi starts licking herself furiously."];

If you want to create some more substantive change to the
environment, just create a function to do the action.
The function must accept one parameter, the actor performing the action.
The "say" function displays information, the "===" comparison returns
true if the two sides are equal, and if-then-else are the Javascript
if-then-else construct very similar to those in many other languages.

Here's an example, where "fill bottle" will cause various actions
depending on the location of the actor (probably the player):

    bottle.$fill = function(actor) {
        if (actor.location === room("Bathroom")) {
            say("The faucet gives off a gargling sound, but no water.");
        } else if (actor.location === room("Kitchen")) {
            say("The faucet gives off a gargling sound, but no water.");
        } else {
            say("There's no source of water here.");
            say("Or beer, for that matter.");
        }
    };


Here's more complicated example, where <tt>!thing("keychain").location</tt>
simply means "the keychain is not located anywhere":

    laundry.$search = function (actor) {
        if (!thing("keychain").location) {
            thing("keychain").move(actor);
            thing("cellphone").move(actor);
            say("Aha! There's your keys and your cellphone. Pocketed.");
        } else {
            say("There's nothing else in there.");
        }
    };


Commands may have a "before" and "after" portion.
If you want something special to happen *after* the normal action,
you can set the "after" action. E.g.:

    thing("beer crate").after$drop = function (actor) {
        if (this.location == room("Corner shop")) {
            this.move(null);
            say('You carefully set the crate down by the counter.'
                + ' "I believe you wanted this back?"');
            say('Mr. Petrescu takes it in the back.'
                + '"Yes, indeed. Thank you, neighbor."');
        }
    }

If the "before" action returns false, the action is halted.

You can define verbs for intransitive verbs (commands without a direct object) by setting them on the story.

# Advanced capabilities

You can directly access the classes used in Jiffo.
The expression "jiffo.Room" refers to the underlying constructor that
creates a room, and "jiffo.Room.prototype" refers to the "prototype" object
for a room.
If you set a property on the prototype object, that sets the default value
for a every object of that class.

Jiffo will be specifically designed so that properties are inherited from
higher-level classes.
Thus, if you don't set a property, it will inherit from higher levels.
This makes it possible to have radical changes in the game, e.g.,
if you change the default value, everything without a specific set value
will use the new default value.

You may note that in general Jiffo (and Jaiffa before it) uses a
<a href="https://en.wikipedia.org/wiki/Fluent_interface">fluent interface</a>,
in particular supporting chaining of methods.
That makes development as easy as it can be in a language like Javascript.

# Current capabilities

Here are the current capabilities and design decisions:

*    Doors can be locked, but not opened or closed. (Felix noted that it normally doesn't matter.)
*   The containment model is simplistic: only rooms and actors can contain other objects. (And scope is pretty much always the same.)  That will be fixed so everything can be a container.
*   There is no concept of a compass. Exits are arbitrary.
*   Rooms are lit by default. (The opposite makes sense from a simulation perspective, but not from a game design perspective.)
*   Objects and exits in a room are explicitly listed. No more guessing what is and isn't there, or relevant for that matter.  The plan is to make that selectable (so it can go either way).
*   By default objects are not portable; that prevents a lot of bugs.
*   The player's location is considered to be in scope.  That way commands such as 'clean kitchen' are easily implemented.
*   There are no light sources.  For now, just flip the dark flag on rooms manually.
*   Currently it uses a simple 2-word parser (this will be updated).

# Future steps

Jiffo is in a very early state.
Here are some expected changes.

## Parser

*   Add saving/loading.
*   In the short term it needs to handle command + direct + indirect, e.g., "put X in Y".
*   Easy "synonym" operation - easily make one word the "standard" word and redirect the others.  Then when you reset one, the others do the same thing.
*   In the long term it needs a full parsing system to support "get all but the X" and so on.


## World model and display

*   Redo the world model.  I plan to change to an class model (not primarily mixins) with more classes, and the ability to easily create new subclasses.
*   Much larger standard set of properties, verbs, etc.
*   Add articles (a/an/the/some/your local...): display and parsing.
*   Greatly improve the display (more spans + CSS)
*   Improve generated list display.
*   It should be designed for easy translation.

  
## Versions of Javascript

The ECMAscript standard version ES5 is widely deployed in modern
browsers (except Internet Explorer).
Thus, everything in ES5 can be used in the implementation.
In 2015 version ES6 was released.  The plan is to slowly start using
those functions where they make sense.
For example, backquoted strings can make long descriptions easier to use.

However, the "class" capabilities of ES6 will *not* be used.
Javascript ES6's "class" system is designed to be fairly
restrictive, and while that may be great for many tasks,
it is not as good for our purposes.
See http://www.2ality.com/2015/02/es6-classes-final.html
for more information.
Here are some examples of why "class" will not be used:

-   A class body can only contain methods, not data properties.  The ability to include data properties is really useful for making mass environment/rule changes, a capability useful in IF games.
-   A constructor must be called with "new"; you can't call the constructor without "new", and thus can't use it to look up existing instances.

## Other potential changes

There may significant changes in the API, as this is pre-1.0 software.
That said, the goal is to make it *easy* to use, so any changes should
make the software *more* pleasant to work with.
Also, you never need to move up; you can always just copy the library
into your directory and only move up when you want to.

Patches welcome.

# Bibliography

Montfort, Nick & Urbano, Paulo (Tr.). A quarta Era da Ficção Interactiva. Nada, Volume 8. October 2006.

