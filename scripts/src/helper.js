import pc from "picocolors";
import { load as yamlLoad } from "js-yaml";
import fs from "fs-extra";
import { IGNORE_WORKSPACE } from "./constant.js";
import minimist from "minimist";
import { execa } from "execa";

export function error(err) {
  console.log(pc.red(err));
}

export function succeed(msg) {
  console.log(pc.green(msg));
}

/**
 * 解析指令
 * @param argvName
 * @returns
 */
export function commandArgv(argvName) {
  const argv = minimist(process.argv.slice(2));
  return argvName ? argv[argvName] || undefined : argv;
}

export async function readWorkspace() {
  const path = "../pnpm-workspace.yaml";
  try {
    const workspace = yamlLoad(await fs.readFile(path, { encoding: "utf8" }), {
      json: true,
    });
    return workspace.packages;
  } catch (e) {
    throw e;
  }
}

export async function filterWorkspace() {
  try {
    const filterArgv = (await readWorkspace()).filter(
      (wr) => !IGNORE_WORKSPACE.includes(wr)
    );
    return filterArgv
      .map((argv) => ["--filter", "../" + argv])
      .flatMap((argv) => argv);
  } catch (e) {
    throw e;
  }
}

export async function getWorkspacePackages(filterArgv = []) {
  const { stdout } = await execa(
    "pnpm",
    ["ls", "-r", "--depth", "-1", "--json"].concat(filterArgv)
  );
  if (!stdout) return [];
  return JSON.parse(stdout);
}
