# elm-rough-coverage
A very simplistic test coverage report generator.

In the absence of a test coverage package for Elm, I present this very simplistic test coverage generator. It tries to at least answer the question: "Which functions did I forget to write tests for?". It's meant to help remind you to write tests for all of your functions. It basically just parses function names from a source file, and searches for them in the corresponding test file - that's it!

## Installation
`npm install -g elm-rough-coverage`


## Usage
### Single test file
`elm-rough-coverage path/to/test/file path/to/source/file`

### Multiple test files (using a config file)
Create a text file named `elm-rough-coverage.txt` in the following format:
```
test/FooTest.elm src/Foo.elm
test/BarTest.elm src/Bar.elm
test/BazTest.elm src/Baz.elm
etc...
```
Then just run `elm-rough-coverage` in the same directory that has the `elm-rough-coverate.txt` file (usually the root of the project)
