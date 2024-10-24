export const createOkResponse = (message: string, data?: any) => {
    return {
        status: 'Ok',
        message,
        data
    }
}

export const createErrorResponse = (message: string, data?: any) => {
    return {
        status: 'Error',
        message,
        data
    }
}