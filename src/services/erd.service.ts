import { saveERDController } from "@/controllers/erd.controller";
import { getSessionStr } from "@/services/session.service";
import { showSnackbar } from "@/components/ui/snackbar";
import { type Node, type Edge } from "@xyflow/react";

export async function saveERDService(payload: {
    teamId: string | number;
    erd: Node[];
    connections: Edge[];
}, snackbarRef: React.RefObject<null>) {
    const token = getSessionStr();

    if (!token) {
        return {
            success: false,
            message: "Session expired. Please sign in again.",
        };
    }

    const response = await saveERDController(payload, token);

    if (response.status !== 200) {
        showSnackbar(response.message, (response.status >= 500 ? "critic" : "warn"), snackbarRef);
        return {
            success: false,
            message: response.message,
        };
    }

    showSnackbar("ERD updated successfully", "valid", snackbarRef);
    
    return {
        success: true,
        message: response.message,
    };
}
