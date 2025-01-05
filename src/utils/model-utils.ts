import { ModelProviderName } from "@ai16z/eliza";

// Provides utilities for managing AI model context windows and token limits
// Handles text truncation and token estimation for different model providers
// Ensures text inputs stay within model-specific token constraints

// Helper function to estimate tokens in a string
function estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
}

// Helper function to truncate text to fit token limit
function truncateToFit(text: string, maxTokens: number): string {
    const estimatedTokens = estimateTokens(text);
    if (estimatedTokens <= maxTokens) return text;
    
    // Preserve roughly the last 75% of the allowed tokens
    const preserveChars = Math.floor((maxTokens * 0.75) * 4);
    return "..." + text.slice(-preserveChars);
}

export function optimizeContextWindow(input: string, provider: ModelProviderName): string {
    const limits = {
        [ModelProviderName.OPENAI]: 128000,
        [ModelProviderName.ANTHROPIC]: 200000,
        [ModelProviderName.LLAMACLOUD]: 32768,
    };

    const maxTokens = limits[provider] || 32768;
    
    if (estimateTokens(input) > maxTokens) {
        return truncateToFit(input, maxTokens);
    }

    return input;
} 