/**
 * agent.ts
 * Provides functionality for creating and configuring agent runtimes
 * This file serves as a wrapper around the core agent configuration logic
 */

import { AgentRuntime, Character, IDatabaseAdapter, ICacheManager } from "@ai16z/eliza";
import { configureRuntime } from "./config/runtime";

/**
 * Creates a new agent runtime with the specified configuration
 * @param character - The character configuration defining the agent's personality and behavior
 * @param db - Database adapter for persistent storage
 * @param cache - Cache manager for temporary storage and performance optimization
 * @param token - API token for the model provider
 * @returns Configured AgentRuntime instance
 */
export function createAgent(
    character: Character, 
    db: IDatabaseAdapter, 
    cache: ICacheManager, 
    token: string
): AgentRuntime {
    return configureRuntime(db, token, character, cache);
} 