// @ts-nocheck

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { z } from "zod";

type ComponentMetadata = {
  description: string;
  docsUrl: string;
  propsSummary?: string;
  example?: string;
};

// Minimal, curated metadata so agents can answer richer questions.
const componentsMetadata: Record<string, ComponentMetadata> = {
  Button: {
    description:
      "Primary action button with theming, disabled / loading states and press feedback.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/button",
    propsSummary:
      "children, onPress, variant, size, isDisabled, isLoading, leftIcon, rightIcon.",
    example: `import { Button } from "@/craftrn-ui/components/Button";
import { View } from "react-native";

export function Example() {
  return (
    <View>
      <Button onPress={() => console.log("Pressed!")}>
        Continue
      </Button>
    </View>
  );
}`,
  },
  Card: {
    description:
      "Surface container for grouping content with padding, elevation and rounded corners.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/card",
    propsSummary: "children, variant, onPress, header, footer, disabled.",
    example: `import { Card } from "@/craftrn-ui/components/Card";
import { Text } from "react-native";

export function ExampleCard() {
  return (
    <Card>
      <Text>Title</Text>
      <Text>Body content goes here.</Text>
    </Card>
  );
}`,
  },
  BottomSheet: {
    description:
      "Modal bottom sheet with snapping points, gestures and safe-area handling.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/bottom-sheet",
    propsSummary:
      "isOpen, onClose, snapPoints, children; plus internal hooks for gestures and backdrop.",
  },
  Avatar: {
    description: "Circle avatar for user profile images or initials.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/avatar",
  },
  ButtonRound: {
    description: "Circular variant of Button, ideal for icon-only actions.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/button-round",
  },
  Checkbox: {
    description: "Animated checkbox with theme-aware states.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/checkbox",
  },
  ContextMenu: {
    description: "Context menu for overflow actions.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/context-menu",
  },
  Counter: {
    description: "Increment / decrement numeric input control.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/counter",
  },
  Divider: {
    description: "Horizontal or vertical separator between content blocks.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/divider",
  },
  InputOTP: {
    description: "Multi-cell OTP / PIN input.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/input-otp",
  },
  InputSearch: {
    description: "Search input with icon and clear affordances.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/input-search",
  },
  InputText: {
    description: "Text input with label, helper and error states.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/input-text",
  },
  ListItem: {
    description:
      "List row with support for title, subtitle, icons and trailing actions.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/list-item",
  },
  PasscodeEntry: {
    description: "Full-screen passcode entry flow using OTP-style inputs.",
    docsUrl:
      "https://docs.craftreactnative.com/docs/components/passcode-entry",
  },
  PhotoCarousel: {
    description: "Image carousel with pagination and gestures.",
    docsUrl:
      "https://docs.craftreactnative.com/docs/components/photo-carousel",
  },
  Radio: {
    description: "Radio buttons for single-choice options.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/radio",
  },
  Skeleton: {
    description: "Shimmering skeleton placeholders while content loads.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/skeleton",
  },
  Slider: {
    description: "Single-value slider for ranges like volume or progress.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/slider",
  },
  SliderDual: {
    description: "Dual-handle slider for selecting a range.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/slider-dual",
  },
  Switch: {
    description: "On/off switch with thumb animation and accessibility.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/switch",
  },
  Text: {
    description: "Typography primitives wired into the theme.",
    docsUrl: "https://docs.craftreactnative.com/docs/components/text",
  },
};

const componentNames = Object.keys(componentsMetadata);

async function main() {
  const server = new McpServer({
    name: "craftrn-ui-mcp",
    version: "0.1.0",
  });

  // Tool: show all components
  server.registerTool(
    "list_components",
    {
      description:
        "List all CraftReactNative UI components that can be added with the CLI.",
      outputSchema: z.object({
        components: z.array(z.string()),
      }),
    },
    async () => {
      return {
        structuredContent: {
          components: componentNames,
        },
      };
    }
  );

  // Tool: get component details (description, docs URL, props summary).
  server.registerTool(
    "get_component_details",
    {
      description:
        "Get description, docs URL, and a short props summary for a component.",
      inputSchema: z.object({
        name: z
          .string()
          .describe("Component name, e.g. Button, Card, BottomSheet."),
      }),
      outputSchema: z.object({
        name: z.string(),
        description: z.string(),
        docsUrl: z.string(),
        propsSummary: z.string().optional(),
      }),
    },
    async (args) => {
      const rawName = args.name as string;
      const match = componentNames.find(
        (c) => c.toLowerCase() === rawName.toLowerCase()
      );

      if (!match) {
        throw new Error(
          `Unknown component "${rawName}". Known components: ${componentNames.join(
            ", "
          )}`
        );
      }

      const meta = componentsMetadata[match];

      return {
        structuredContent: {
          name: match,
          description: meta.description,
          docsUrl: meta.docsUrl,
          propsSummary: meta.propsSummary,
        },
      };
    }
  );

  // Tool: get a ready-to-paste example usage snippet (when available).
  server.registerTool(
    "get_component_example",
    {
      description:
        "Return a small TSX example for using a component (when available).",
      inputSchema: z.object({
        name: z
          .string()
          .describe("Component name, e.g. Button or Card."),
      }),
      outputSchema: z.object({
        name: z.string(),
        example: z.string(),
      }),
    },
    async (args) => {
      const rawName = args.name as string;
      const match = componentNames.find(
        (c) => c.toLowerCase() === rawName.toLowerCase()
      );

      if (!match) {
        throw new Error(
          `Unknown component "${rawName}". Known components: ${componentNames.join(
            ", "
          )}`
        );
      }

      const meta = componentsMetadata[match];
      if (!meta.example) {
        throw new Error(
          `No inline example registered for ${match}. Check the docs instead: ${meta.docsUrl}`
        );
      }

      return {
        structuredContent: {
          name: match,
          example: meta.example,
        },
      };
    }
  );

  // Tool: generate CLI command to install components.
  server.registerTool(
    "generate_install_command",
    {
      description:
        "Generate an npx command to install one or more CraftReactNative UI components.",
      inputSchema: z.object({
        components: z
          .array(z.string())
          .nonempty()
          .describe("Component names to install."),
        latest: z
          .boolean()
          .optional()
          .describe("If true, use @latest when calling the CLI."),
      }),
      outputSchema: z.object({
        command: z.string(),
      }),
    },
    async (args) => {
      const { components, latest } = args;
      const base = latest
        ? "npx @craftreactnative/ui@latest add"
        : "npx @craftreactnative/ui add";
      const command = `${base} ${components.join(" ")}`;

      return {
        structuredContent: {
          command,
        },
      };
    }
  );

  // Tool: theming / dark mode overview.
  server.registerTool(
    "get_theme_overview",
    {
      description:
        "Describe the main theme variables and how dark mode works in CraftReactNative UI.",
      outputSchema: z.object({
        docsUrl: z.string(),
        summary: z.string(),
      }),
    },
    async () => {
      return {
        structuredContent: {
          docsUrl: "https://docs.craftreactnative.com/docs/theming/overview",
          summary:
            "CraftReactNative UI uses Unistyles for theming. You define a theme object with colors, spacing, radii and typography, and components consume tokens like colors.backgroundScreen, colors.textPrimary, spacing.large, etc. Dark mode is handled by defining a dark theme variant and switching using Unistyles' color scheme support.",
        },
      };
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("craftrn-ui MCP server error:", err);
  process.exit(1);
});

