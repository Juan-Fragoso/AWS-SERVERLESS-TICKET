export class Router {
    isCreateTicket(path: string, method: string): boolean {
        return path === "/v1/tickets" && method === "POST";
    }
}