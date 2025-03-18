import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { findTranslation } from "../common/language/translations";
import { router } from "../router/Route";

class ErrorHandler {
    public static async handleError(error: AxiosError<any>, location: any): Promise<void> {
        const { data, status } = error.response || {};

        switch (status) {
            case 0:
                await this.handleRequestError(data, location);
                break;
            case 400:
                await this.handleRequestError(data, location);
                break;
            case 401:
                await this.handleUnauthorizedError(data, location);
                break;
            case 403:
                await this.handleForbiddenError(data?.input, location);
                break;
            case 404:
                this.handleNotFound();
                break;
            case 500:
                await this.handleServerError(data, location);
                break;
            default:
                this.showToast("unexpectedError", location);
                break;
        }
    }

    private static async handleRequestError(data: any, location: any): Promise<void> {
        const title = data.title || "";
        const translatedTitle = await this.translateTitle(title, location);
        const messageType = translatedTitle === "failedLogin" ? "error" : "warning";
        this.showToast(translatedTitle, location, messageType);
    }

    private static async handleUnauthorizedError(data: any, location: any): Promise<void> {
        const title = data.title || "";
        const translatedTitle = await this.translateTitle(title, location);
        this.showToast(translatedTitle, location, "warning");
        router.navigate('/login');
    }

    private static async handleServerError(data: any, location: any): Promise<void> {
        const message = data.message || "";
        const messageType = message.includes('JWT expired') ? "warning" : "error";
        this.showToast("tokenHasExpired", location, messageType);
        router.navigate('/login');
    }

    private static handleNotFound(): void {
        router.navigate('/not-found');
    }

    private static async handleForbiddenError(input: string, location: any): Promise<void> {
        const [module, action] = input?.split(',') || [];
        if (!module || !action) {
            this.showToast("unexpectedError", location);
            return;
        }
        const errorMessage = await this.buildForbiddenErrorMessage(module, action, location);
        toast.warning(errorMessage);
        router.navigate('/');
    }

    private static async buildForbiddenErrorMessage(module: string, action: string, location: any): Promise<string> {
        const unauthorized = await this.translateTitle("unauthorized", location);
        const noPermission = await this.translateTitle("noPermission", location);
        const forModule = await this.translateTitle("forModule", location);
        return `${unauthorized} ${noPermission} ${action} ${forModule} ${module}`;
    }

    private static async translateTitle(title: string, location: any): Promise<string> {
        const lowerCaseTitle = title.toLowerCase().replace(/_/g, '');
        return findTranslation(lowerCaseTitle, location);
    }

    private static showToast(title: string, location: any, type: 'error' | 'warning' = 'error'): void {
        const translatedMessage = findTranslation(title, location);
        type === 'error' ? toast.error(translatedMessage) : toast.warning(translatedMessage);
    }
}

export default ErrorHandler;