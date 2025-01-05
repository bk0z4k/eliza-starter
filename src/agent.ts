// Manages the creation and configuration of an agent runtime

import { AgentRuntime, Character, IDatabaseAdapter, ICacheManager } from "@ai16z/eliza";
import { configureRuntime } from "./config/runtime";

export function createAgent(
    character: Character, 
    db: IDatabaseAdapter, 
    cache: ICacheManager, 
    token: string
): AgentRuntime {
    return configureRuntime(db, token, character, cache);
} 