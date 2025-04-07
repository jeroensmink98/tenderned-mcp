import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server with enhanced metadata for better detection
const server = new McpServer({
  name: "tenderned-server",
  version: "1.0.0",
  description: "A server for the Tenderned API",
});

// Initialize the API client
const api = new OorlogsbronnenAPI();

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
