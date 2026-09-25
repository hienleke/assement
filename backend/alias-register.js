import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(new URL("./alias-hooks.js", import.meta.url).href, pathToFileURL("./"));
