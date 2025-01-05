// Handles Discord-specific client configuration and initialization

import { DiscordClientInterface } from "@ai16z/client-discord";
import { IAgentRuntime } from "@ai16z/eliza";
import { GatewayIntentBits, IntentsBitField } from 'discord.js';

export async function initializeDiscordClient(runtime: IAgentRuntime) {
    // Create intents using IntentsBitField
    const intents = new IntentsBitField([
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
    ]);

    // Set the intents on the runtime object if needed
    (runtime as any).discordIntents = intents.bitfield;

    // Just pass the runtime
    const client = await DiscordClientInterface.start(runtime);
    
    return client;
} 