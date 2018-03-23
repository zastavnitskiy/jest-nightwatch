# Experimental jest-nightwatch runner.
Allows users run night watch tests from jest ui.

# ToDo
In jest runner:

* For each file
	* Instanciate client(selenium+nightwatch)
	* Run test, pass this client
	* Collect report and convert to jest format.

# Contributing
Run nightwatch:

`yarn nw-cli`

Run jest:

`yarn jest`