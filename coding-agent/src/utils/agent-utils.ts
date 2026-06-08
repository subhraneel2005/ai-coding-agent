import type { StopCondition } from "ai";
import type { tools } from "../tools-registry";

// custom stopping condition:
const hasReviewComment: StopCondition<typeof tools> = ({ steps }) => {
    return steps.some(step => {
        const txt = step.text ?? "";
        return txt.includes("REVIEW") || txt.includes("COMMENT") || txt.includes("ANSWER");
    });
};


export { hasReviewComment }