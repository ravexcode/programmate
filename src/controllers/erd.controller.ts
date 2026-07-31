import { type Node, type Edge } from "@xyflow/react";
import { saveERDRequest } from "@/client/erd";

export async function saveERDController(payload: {
    teamId: string | number;
    erd: Node[];
    connections: Edge[];
}, token: string) {
    const res = await saveERDRequest(token, payload);

    return {
        status: res.status,
        message: res.data.message,
        ...res.data,
    };
}
