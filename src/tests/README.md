### Setup
Before doing anything on this directory, follow the instructions in the root's [README.md](https://github.com/datasektionen/harmony/edit/addtest/src/tests/README.md) file.

### Introduction
This directory contains the baseline files of the provisional test framework. It contains the files `test-subcommands.ts`, 
`test.command.ts`, `test.handler.ts` which define together a `test` command. The main idea is that since there is no formal 
'test framework currently applied to harmony, a provisional test framework allowing almost absolute freedom to collaborators 
is proper. The only requirement is that the collaborators have to execute their tests using the `test` command, implementing 
tests as separate subcommands to `test`.

### What not to do
This provisional framework assumes that the collaborators follow the following rules:
* No changes to the file `test.ts` are to be committed unless for the express purpose of changing the framework itself.
* No source files outside of this directory should import anything from any source file in this directory or any of its subdirectories, except for data already defined in `test.ts`.
* No local files testing that have to do with testing are allowed to be committed, this include subcommand definitions, test cases, test logic, etc. This is best avoided by only working with local tests inside the `src/tests/` directory, which is ignored by `.gitignore`. 

 ### The `test` command
 The `test` command is only loaded to the application if it has some subcommands added to it. This means that by default the `test` command will not be loaded. This was a design choice to avoid polluting the production app with testing artifacts. This command is used by first adding subcommands to it, these subcommands are created locally, more information on how to add a subcommand is explained in the next section. These subcommands can be seen as the triggers for test execution and it is recommended to create different subcommands for testing different features, but the collaborator still has complete autonomy on how many subcommands are defined. This mechanism is deemed enough for testing an interactive application such as a Discord bot.

 ### Adding a subcommand
As stated above, this provisional framework allows great degree of freedom to the collaborator. To ensure this freedom however the collaborator needs to abide the following process:
* Create a subdirectory `src/tests/local/` locally, this (or anything inside it) will not be tracked by Git.
* Create a file `testConf.json` with filepath `src/tests/local/testConf.json`.
* Write in this file data as specified in the next section of this document to allow the program to dynamically load the subcommands.
* Define a `SlashCommandSubcommandBuilder` representing the subcommand itself to be added to `test` and a handler to this subcommand as an `async` function with `Promise<void>` return type an argument of type `GuildChatInputCommandInteraction`, both need to be exported by using the `export` keyword in the source file.

Apart from those requirements the collaborator may do as they please, they may organize their test cases and testing logic how they see fit.
### `testConf.json` file format
In the previous section, one of the requirements to set up the testing environment is to create a `testConf.json` file with filepath `src/tests/local/testConf.json`, in this section the format of this file is outlined and why.

The file should contain a single list JSON object containing objects with the following fields:
* `subCommand`: The name of the exported variable that contains the subcommand (a `SlashCommandSubcommandBuilder` type).
* `subCommandFilePath`: Filepath relative to the `testConf.json` file of the source file where this subcommand definition is located.
* `subCommandHandlerName`: The name of the exported function that defines the subcommand's handler (an `async` function with a single argument of type `GuildChatInputCommandInteraction` and return type `Promise<void>`).
* `subCommandHandlerFilePath`: Filepath relative to the `testConf.json` file of the source file where this handler definition is located.

Note that these names for the fields are sensitive, they need to be in the local file as shown in this list, otherwise the program will not be able to parse the object. The reason for choosing a JSON file is that it allows an easier parsing of an object in TypeScript, more specifically, the program parses these JSON objects into `SubCommmandConfiguration` types (defined in `src/tests/test.ts`). The four fields `subCommand`, `subCommandFilePath`, `subCommandHandlerName`, `subCommandHandlerFilePath` are required to make two dynamic imports for each subcommand, one for the subcommand itself (so that it shows on Discord and can actually be parsed without issues), and one for the handler (the main trigger that sets off the execution of the tests by calling the subcommand).
### Example
This section outlines an example of how the test environment is set up and the resulting directory tree would look like when adding a subcommand.
#### Required setup
At the very least, the directory tree should look as follows:
```
 src/tests/
├─ local/
│   ├─ testConf.json
├─ test.ts
├─ README.md
```

#### Example subcommand addition
Suppose that a subcommand `example` is to be added. Note that the presented structure is mostly a personal taste and the subcommand and its handler could be defined to have more complex behavior. The only requirement is that as seen in the previous subsection **Required setup**, parting from it, the directory tree could look as follows:
```
 src/tests/
├─ local/
│   ├─ example/
│   │   ├─ test-example.subcommand.ts
│   │   ├─ test-example.handler.ts
│   │   ├─ test-example.testCases.ts
│   │   ├─ test-example.test.ts
│   ├─ testConf.json
├─ test.ts
├─ README.md
```
The `test-example.subcommand.ts` would contain the subcommand definition in this case, like:
```
import { SlashCommandSubcommandBuilder } from "discord.js"

const subcommand = new SlashCommandSubcommandBuilder()
    .setName("example")
    .setDescription("This is an example command")

export const testExampleSubcommand = subcommand;
```
The handler for the subcommand would be located in `test-example.handler.ts` and could look like:
```
import { GuildChatInputCommandInteraction } from "../../../shared/types/GuildChatInputCommandType";
import { executeTests } from "./test-example.test.ts";

export async function handleTestExample(interaction: GuildChatInputCommandInteraction): Promise<void> {
    await executeTests();
}
```
From both of these files we gather the name of the exported subcommand to be `testExampleSubcommand` and the handler's to be `handleTestExample`. Therefore the `testConf.json` file would look as follows:
```
[
    {
        "subCommand": "testExampleSubcommand",
	       "subCommandFilePath": "/example/test-example.subcommand.ts",
	       "subCommandHandlerName": "handleTestExample",
	       "subCommandHandlerFilePath": "/example/test-example.handler.ts"
    }
]
```
This is enough setup to have the application load the `test` command with a `example` subcommand added to it that executes `handleTestExample` when called.
