#Capstone 2 Back-End Server

This is the back-end server for my 2nd Capstone project: The Starting Tavern. This API allows user to create  Dungeons and Dragons characters. The repository for the front-end web application can be found [here](https://github.com/alocke8181/capstone2-app). The goal of this project is to demonstrate everything I learned in the second half of the Springboard Software Engineering Bootcamp. 

Users can register an account and then create characters, as well as custom attacks, traits, and features associated with those characters. The API has full CRUD capability with all aspects. All users, characters, attacks, custom traits, and  custom features are stored on a Postgres SQL database. Pre-existing traits, features, spells, and many other properties are pulled from an external [D&D API](https://www.dnd5eapi.co/).

Many routes require some form of authorization. This is done via JSON Web Tokens. When a user logs in or registers, a JWT of the user is created and sent out. This must be returned via request headers for certain routes. The JWT is then verified and decoded by the server to allow for further authorization checks.

The website is live [here](https://the-starting-tavern.onrender.com/). If it seems to be taking a long time to load it's because Render.com spins down free web pages and servers. So give it time to spin the app and server back up.

##Routes
* Authorization `/auth`
	* `POST '/token' {username, password}` - Takes a username and password to login. On success, returns a JWT of the user and the user object. No authorization required.
	* `POST '/register' {user}` - Takes a user object of `{username, password, email}`, creates a new user, and returns the token and user object. Uses JSON validation to make sure all information is correct. No authorization is required. 
* Users `/users`
	* `GET '/'` - Get a list of all users, returning their ID's, usernames, passwords, emails, and `isAdmin` properties (specifies if the user is an administrator or not). Only admins are able to access this route.
	* `GET '/:id'` - Get a user's information based on an ID number. Returns their username, email, and `isAdmin` property which specifies if the user is an administrator or not. No authorization is required.
	* `POST '/' {username, password, email, isAdmin}` - Post data to create a new user. Passwords are encrypted with Bcrypt before being stored on the database. Usernames must be unique. Returns `id, username, email, isAdmin`. Requires admin, as this route is intended for admins to create other ones.
	* `PATCH '/:id' {password, email}` - Patch a user's information. Returns updated user object. Must be an admin or the correct user.
	* `DELETE '/:id'` - Delete a user. Returns a success message confirming deletion. Requires admin or correct user token.
* Characters `/characters`
	* `GET '/'` - Returns a list of full character objects of all characters. Admin only route.
	* `GET '/:id'` - Return a full character object based on an ID. No authorization is required. Extensive middleware is used in this route to convert from the SQL data to a full object for the front-end.
	* `GET '/users/:id'` - Get a list of all characters belonging to a user based on their user ID. This route does not return the full characters, only their name, race, class, background, level, and experience. Requires admin or the correct user.
	* `POST '/' {creatorID, charName, race, className, background, level, exp}` - Post a new character to the database. The information sent in is used by the server to convert the SQL data into a full character for the front-end. This route only returns the characters' ID, since the front-end will use it to redirect to the character's page. This requires admin or the correct user.
	* `PATCH '/:id' {data}` - Patch a character on the server. Extensive conversion is done when receiving and sending character data. Requires admin or the correct user.
	* `DELETE '/:id' {userID}` - Delete a character. Requires admin or the correct user.
* Attacks `/attacks`
	* `GET '/:id'` - Returns a full attack object. Requires no authorization.
	* `POST '/' {data}` - Post a new attack to the database for a character. Returns an attack object. Must be admin or user ID matches that for the character.
	* `PATCH '/:id' {data}` - Patch an existing attack. Returns the updated attack object. Must be admin or user ID matches that for the character.
	* `DELETE '/:id' {userID}` - Delete an attack. Must be admin or user ID matches that for the character.
* Features `/features`
	* `GET '/:id'` - Returns a full feature object. Requires no authorization.
	* `POST '/' {name, description}` - Post a new feature to the database for a character. Returns a feature object. Must be admin or user ID matches that for the character.
	* `PATCH '/:id' {name, description}` - Patch an existing feature. Returns the updated feature object. Must be admin or user ID matches that for the character.
	* `DELETE '/:id' {userID}` - Delete a feature. Must be admin or user ID matches that for the character.
* Traits `/traits`
	* `GET '/:id'` - Returns a full trait object. Requires no authorization.
	* `POST '/' {name, description}` - Post a new trait to the database for a character. Returns a trait object. Must be admin or user ID matches that for the character.
	* `PATCH '/:id' {name, description}` - Patch an existing trait. Returns the updated trait object. Must be admin or user ID matches that for the character.
	* `DELETE '/:id' {userID}` - Delete a trait. Must be admin or user ID matches that for the character.

##Other Notes
As previously mentioned, this server pulls data from an external API. This includes certain attributes about a character's race or class, or pre-existing traits, features, and spells. This is done as a convenience for the user, as entering in this information manually can be exhausting. **An important note however:** the external API does not include all D&D races and classes, only those in the *Player's Handbook*. This does limit the options a user has when creating characters. 

##Long-Term Goals
One long-term goal is to have racial traits and class features be automatically added on character creation. This would make the process even faster as less data would need to be entered by the user.

Another long-term goal is to either add other races/classes by storing their information internally, or allow the creation of custom races/classes. This would allow a much wider variety of characters that can be made, but would complicate things by also necessitating storing each race/class traits/features on the server too, to allow for the automatic adding of them.

##Tools Used
JavaScript, Node.js, Express, JSON Web Tokens, JSON Schema Verification, PostgreSQL.