/**
 * discord.ts
 * Configures and initializes the Discord client interface
 * Handles Discord-specific permissions and gateway intents setup
 */

import { DiscordClientInterface } from "@ai16z/client-discord";
import { IAgentRuntime } from "@ai16z/eliza";
import { GatewayIntentBits, IntentsBitField } from 'discord.js';

/**
 * Initializes a Discord client with the necessary permissions and intents
 * @param runtime - The agent runtime instance to attach the Discord client to
 * @returns Initialized Discord client interface
 * 
 * Required Intents:
 * - Guilds: Access to server information
 * - GuildMessages: Read and send messages in servers
 * - MessageContent: Access message content
 * - GuildMembers: Access member information
 * - GuildPresences: Track member presence
 * - DirectMessages: Handle private messages
 */
export async function initializeDiscordClient(runtime: IAgentRuntime) {
    // Configure Discord gateway intents using IntentsBitField
    const intents = new IntentsBitField([
        GatewayIntentBits.Guilds,           // Server access
        GatewayIntentBits.GuildMessages,    // Server messages
        GatewayIntentBits.MessageContent,   // Message content
        GatewayIntentBits.GuildMembers,     // Member info
        GatewayIntentBits.GuildPresences,   // Online status
        GatewayIntentBits.DirectMessages,   // DMs
    ]);

    // Attach intents to runtime for Discord.js initialization
    (runtime as any).discordIntents = intents.bitfield;

    // Initialize and return the Discord client interface
    const client = await DiscordClientInterface.start(runtime);
    
    return client;
} 