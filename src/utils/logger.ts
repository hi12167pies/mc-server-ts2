import colors from "colors"
colors.enable()

const infoString = "Info".blue
const errorString = "Error".red
const debugString = "Debug".cyan
const warningString = "Warning".yellow

export function arrayString(data: number[]) {
  return data.map(char => String.fromCharCode(char)).join("")
}

export function loggerInfo(...data: any[]) {
  timeLog(`[${infoString}] `, ...data)
}

export function loggerDebug(...data: any[]) {
  timeLog(`[${debugString}] `, ...data)
}

export function loggerError(...data: any[]) {
  timeLog(`[${errorString}] `, ...data)
}

export function loggerWarn(...data: any[]) {
  timeLog(`[${warningString}] `, ...data)
}

const disabled = process.argv.includes("-logoff")
function timeLog(...data: any[]) {
  if (disabled) return
  console.log(`[${getDate()}] `, ...data)
}

function getDate() {
  return new Date()
    .toLocaleTimeString()
    .replace(" ", "")
}