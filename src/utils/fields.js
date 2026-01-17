function normalizeToNull(value) {
    if (value === null || value === undefined) return null;
    const trimmed = String(value).trim();
    return trimmed === '' ? null : trimmed;
};

export { normalizeToNull };