



export function parseJwt(token: string) {
  try {
    console.log("Raw token:", token);
    
    const base64Url = token.split(".")[1];
    //console.log("Base64 URL part:", base64Url);
    
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    //console.log("Base64 after replacement:", base64);
    
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );
    
    console.log("JSON payload string:", jsonPayload);
    
    const parsed = JSON.parse(jsonPayload);
    //console.log("Parsed payload:", parsed);
    //console.log("Email from payload:", parsed.email);
    
    return parsed;
  } catch (e) {
    console.error("Invalid token:", e);
    return null;
  }
}
  