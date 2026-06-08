import { diffLines } from "diff"

export function printDiff(preview: { before: string, after: string }) {
    const diff = diffLines(preview.before, preview.after)

    diff.forEach((part) => {
        if (part.added) {
            part.value.split("\n").forEach(line => {
                if (line.trim() === "") return
                console.log("+".green, line.green)
            })
        } else if (part.removed) {
            part.value.split("\n").forEach(line => {
                if (line.trim() === "") return
                console.log("-".red, line.red)
            })
        } else {
            part.value.split("\n").forEach(line => {
                if (line.trim() === "") return
                console.log(" ".grey, line)
            })
        }
    })
}