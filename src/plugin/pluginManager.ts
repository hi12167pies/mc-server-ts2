import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { loggerError, loggerInfo } from "../utils/logger";
import { Plugin } from "./plugin";
import { PluginJson } from "../types";

export const plugins: Set<Plugin> = new Set();

export async function loadPlugins() {
  const pluginList = readdirSync(path.join(process.cwd(), "plugins"))


  for (const directory of pluginList) {
    const stat = statSync(path.join(process.cwd(), "plugins", directory))
    if (!stat.isDirectory()) continue

    try {
      const jsonString = readFileSync(path.join(process.cwd(), "plugins", directory, "plugin.json"), "utf8")
      const json: PluginJson = JSON.parse(jsonString)

      if (!validatePluginJson(json)) {
        loggerError("Invalid plugin.json " + directory)
        return
      }

      const plugin = new Plugin(json)

      const mainFile = await import(path.join(process.cwd(), "plugins", directory, plugin.info.main))

      if (typeof mainFile.main != "function") {
        loggerError("Invalid main method " + plugin.info.name)
        return
      }
      
      try {
        mainFile.main(plugin)
      } catch (e) {
        loggerError(`Failed to load ${plugin.info.name}`, e)
        return
      }
      plugins.add(plugin)
      loggerInfo("Loaded plugin " + plugin.info.name)
    } catch (e) {
      loggerError("Failed to load plugin " + directory, e)
    }
  }
}

function validatePluginJson(json: any) {
  return typeof json.name == "string"
      && typeof json.main == "string"
}