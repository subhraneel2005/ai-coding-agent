import readline from "readline"

export function askUser(q: string): Promise<string> {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })

        rl.question(q, (ans) => {
            rl.close()
            resolve(ans)
        })
    })
}