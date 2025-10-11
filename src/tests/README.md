### Setup
Before doing anything on this directory, follow the instructions in the root's [README.md](https://github.com/datasektionen/harmony/edit/addtest/src/tests/README.md) file

### Introduction
This directory contains the baseline files of the provisional test framework. It contains the files `test-subcommands.ts`, 
`test.command.ts`, `test.handler.ts` which define together a `test` command. The main idea is that since there is no formal 
'test framework currently applied to harmony, a provisional test framework allowing almost absolute freedom to collaborators 
is proper. The only requirement is that the collaborators have to execute their tests using the `test` command, implementing 
tests as separate subcommands to `test`.

### What not to do
This provisional framework assumes that the collaborators follow the following rules:
* No changes to the baseline files `test-subcommands.ts`, `test.command.ts`, `test.handler.ts` are to be committed unless for the express purpose of changing the framework itself.
* No source files outside of this directory should import anything from any source file in this directory, except for data defined in the baseline files.

 ### The `test` command
 The `test` command is only loaded to the application if it has some subcommands defined on it 
 (tracked by the amount of keys in the `TestSubcommands` enum in `test-subcommands.ts`). This means that by default the `test` 
 command will not be loaded. This was a design choice to avoid polluting the production app with testing artifacts.

 ### Adding a subcommand
As stated above, this provisional framework allows great degree of freedom to the collaborator, the only thing they need 
is to define a subcommand for the `test` commands by changing the baseline files locally and/or adding new directories and 
files to have a better structure. An example of an structure is the one shown in the tree below

 src/tests/
 
├─ example/

│   ├─ test-cases.ts

│   ├─ test-logic.ts

│   ├─ test-example.handler.ts

├─ test-subcommands.ts

├─ test.command.ts

├─ test.handler.ts

├─ README.md


This tree represents how adding the `example` subcommand could look like, the command and subcommands follow the same 
structure as the main application commands found in `src/commands` for the sake of familiarity. That is, the 
`src/tests/example` directory in this example would contain the test data in `test-cases.ts`, the test execution 
logic in `test-logic.ts`, and the subcommand execution would be inside `test-example.handler.ts`. Then the baseline 
files are also modified to add the subcommand to `test`.
