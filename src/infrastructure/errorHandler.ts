export const errorHandler = (handler: (...args: any[]) => any) => {
    const handleError = (err: any) => {
        // console.error("please handle me", err);
    };

    return (...args: any[]) => {
        try {
            const ret = handler.apply(this, args);
            if (ret && typeof ret.catch === "function") {
                // async handler
                ret.catch(handleError);
            }
        } catch (e) {
            // sync handler
            handleError(e);
        }
    };
};
