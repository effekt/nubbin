/** What a person sees when the command line could not be run as given, or when they ask. */
export const USAGE = `nubbin <command> [arguments]

  compile <route>            compile the route's document and report what it would publish as
  publish <route>            compile, write the artifact, then point the route at it
  unpublish <route>          drop the route's pointer; the artifact stays where it is
  rollback <route> <hash>    point the route back at an artifact already in the store
  history <route>            what the route has pointed at, newest first
  show <route>               the document as authored: ids, blocks, and the slots they sit in
  add <route> <block>        mint a node into a parent's slot, and print its id
  remove <route> <id>        remove the node and everything beneath it
  move <route> <id>          move the node into a parent's slot
  set <route> <id> <path> <value>   set one prop; JSON when it parses, the string otherwise
  status [route]             what is live, everywhere or at one route
  check                      every live route against the registry as it is now
  help                       this text, as an answer rather than a complaint

  --config <path>            a config file, instead of searching upward for one
  --origin <url>             publish through a running application, not straight into the store
  --to <version>             roll back to a document version, resolved through the history
  --parent <id>              the node whose slot receives what add and move place
  --slot <name>              which slot on that parent
  --index <n>                where in the slot; absent means the end`;
