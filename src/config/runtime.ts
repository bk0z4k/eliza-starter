/**
 * runtime.ts
 * Configures the core runtime environment for agent instances
 * This file handles the initialization of all necessary components for an agent to function
 */

import { 
    AgentRuntime, 
    Character, 
    IDatabaseAdapter, 
    ICacheManager,
    elizaLogger,
    ModelProviderName
} from "@ai16z/eliza";
import { bootstrapPlugin } from "@ai16z/plugin-bootstrap";
import { nodePlugin } from "@ai16z/plugin-node";
import { solanaPlugin } from "@ai16z/plugin-solana";

/**
 * Creates and configures a new runtime environment for an agent
 * @param db - Database adapter for persistent storage
 * @param token - API token for the model provider
 * @param character - Character configuration defining agent behavior
 * @param cache - Cache manager for performance optimization
 * @returns Configured AgentRuntime instance with all necessary components
 */
export function configureRuntime(
    db: IDatabaseAdapter,
    token: string,
    character: Character,
    cache: ICacheManager
): AgentRuntime {
    // Log the creation of a new runtime instance
    elizaLogger.success(
        elizaLogger.successesTitle,
        "Creating runtime for character",
        character.name
    );

    // Initialize and return a new runtime instance with all required components
    return new AgentRuntime({
        databaseAdapter: db,          // Database connection
        token,                        // API token for model access
        modelProvider: character.modelProvider,  // AI model provider (e.g., Anthropic)
        evaluators: [],               // Custom evaluation functions (empty by default)
        character,                    // Character configuration
        plugins: [                    // Load required plugins
            bootstrapPlugin,          // Core functionality
            nodePlugin,               // Node.js specific features
            // Conditionally load Solana plugin if wallet is configured
            character.settings.secrets?.WALLET_PUBLIC_KEY ? solanaPlugin : null,
        ].filter(Boolean),           // Remove null entries
        providers: [],               // Custom providers (empty by default)
        actions: [],                 // Custom actions (empty by default)
        services: [],                // Additional services (empty by default)
        managers: [],                // Custom managers (empty by default)
        cacheManager: cache,         // Cache management system
    });
}