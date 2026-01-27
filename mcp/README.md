# CraftReactNative UI MCP Server

MCP server that exposes basic tools around **CraftReactNative UI** so AI agents can:

- Discover available components
- Generate ready-to-run `npx @craftreactnative/ui` commands

## Install & build

```bash
cd mcp
npm install
npm run build
```

## Run the server (stdio)

```bash
cd mcp
npm start
```

The entrypoint `dist/server.js` uses stdio via `StdioServerTransport`, so any MCP-compatible client (Cursor, Claude Desktop, etc.) can launch it as a subprocess.

## Exposed tools

### `list_components`

- **Description**: Returns the list of available CraftReactNative UI components.
- **Input**: none
- **Output**:
  - `components: string[]`

### `generate_install_command`

- **Description**: Generates an `npx @craftreactnative/ui` command to install components.
- **Input**:
  - `components: string[]` – one or more component names
  - `latest?: boolean` – if `true`, uses `@latest` in the command
- **Output**:
  - `command: string`

