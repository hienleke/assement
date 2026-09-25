export function validateParam(name, schema, message = "invalid request") {
  return (req, res, next) => {
    const result = schema.safeParse(req.params[name]);
    if (!result.success) {
      res.status(400).json({ error: result.error.issues[0]?.message || message });
      return;
    }
    req.validated = { ...req.validated, [name]: result.data };
    next();
  };
}

export function validateBody(schema, message = "invalid request") {
  return (req, res, next) => {
    const result = schema.safeParse(req.body ?? {});
    if (!result.success) {
      res.status(400).json({ error: result.error.issues[0]?.message || message });
      return;
    }
    req.body = result.data;
    next();
  };
}

export function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}
