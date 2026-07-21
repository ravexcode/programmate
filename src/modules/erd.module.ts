import { saveERDService } from "@/services/erd.service";
import { type Node, type Edge } from "@xyflow/react";

export async function saveERD(payload: {
    teamId: string | number;
    erd: Node[];
    connections: Edge[];
}, snackbarRef: React.RefObject<null>) {
    return await saveERDService(payload, snackbarRef);
}
