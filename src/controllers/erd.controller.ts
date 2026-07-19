import { type Node, type Edge } from "@xyflow/react";

export async function saveERDController(payload: {
    teamId: string | number;
    erd: Node[];
    connections: Edge[];
}, token: string) {
    const res = await fetch(`/api/teams/${payload.teamId}/erd`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "nexzero-api-key": process.env.NEXT_PUBLIC_API_KEY!,
            "Authorization": token,
        },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    return {
        status: res.status,
        message: data.message,
        ...data,
    };
}
