export function notFound(_req, res) {
  res.status(404).json({ error: "not found" });
}

export function errorHandler(err, _req, res, _next) {
  console.error(`[http] ${err.message}`);
  res.status(500).json({ error: "internal server error" });
}
