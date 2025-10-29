const DEFAULT_API_URL = "https://api.strem.io";

export async function publishToCentral(
  addonURL: string,
  apiURL: string = DEFAULT_API_URL,
) {
  const res = await fetch(apiURL + "/api/addonPublish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transportUrl: addonURL, transportName: "http" }),
  });
  const body = await res.json();

  if (body.error) {
    throw body.error;
  }

  return body.result;
}
