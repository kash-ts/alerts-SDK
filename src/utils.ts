/**
 * Format an axios error into a readable error message.
 *
 * @param {any} error - The error thrown by axios or any other source
 * @returns {string} A formatted error message
 */

export function formatAxiosError(error: any): string {
    if (error?.response?.data?.error_description) {
        return error.response.data.error_description;
    }
    if (error?.response?.data?.message) {
        return error.response.data.message;
    }
    if (error?.response?.data?.error) {
        return error.response.data.error;
    }
    if (error?.message) {
        return error.message;
    }
    return String(error);
}
