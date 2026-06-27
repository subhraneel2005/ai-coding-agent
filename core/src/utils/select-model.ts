import { select } from "@inquirer/prompts"
import { OPENROUTER_FREE_MODELS } from "../../free-models"
import { openrouter } from "../config/openrouter"

export async function selectModel() {
    const model = await select({
        message: "Choose model",
        choices: OPENROUTER_FREE_MODELS.map(m => ({
            name: m,
            value: m
        }))
    })

    return {
        chatModel: openrouter.chat(model),
        modelId: model
    }
}