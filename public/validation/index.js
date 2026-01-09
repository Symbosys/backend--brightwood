export const zodError = (error) => {
    let errors = {};
    error.issues.map((issue) => {
        const path = issue.path?.[0];
        if (path)
            errors[path] = issue.message;
    });
    return errors;
};
//# sourceMappingURL=index.js.map