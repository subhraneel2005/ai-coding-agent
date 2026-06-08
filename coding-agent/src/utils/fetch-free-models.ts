import { writeFile } from "fs/promises"

type Model = {
    id: string
    architecture?: {
        output_modalities?: string[]
    }
    pricing?: {
        prompt?: string
        completion?: string
        request?: string
    }
}

async function saveFreeModels() {
    const res = await fetch(
        "https://openrouter.ai/api/v1/models?output_modalities=text"
    )

    const json = (await res.json()) as { data: Model[] }

    const freeModels = json.data
        .filter(
            m =>
                m.pricing?.prompt === "0" &&
                m.pricing?.completion === "0" &&
                (m.pricing?.request === "0" || !m.pricing?.request)
        )
        .map(m => m.id)

    await writeFile(
        "./free-models.json",
        JSON.stringify(freeModels, null, 2)
    )

    console.log(`Saved ${freeModels.length} free models`)
}

saveFreeModels()