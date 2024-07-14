structure:
```
├─── plugins
│   └─── example
│       ├─── main.ts
|       └─── plugin.json
```

plugin.json
```json
{
  "name": "example",
  "main": "main"
}
```

main.ts
```ts
export function main(plugin: Plugin) {
  console.log("Enabled", plugin.info.name)
}
```