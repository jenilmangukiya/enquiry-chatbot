import { google } from "googleapis";

/**
 * Utility to sanitize environment variables by trimming whitespace
 * and stripping any enclosing single or double quotes.
 */
function sanitizeEnvVar(val: string | undefined): string {
  if (!val) return "";
  let trimmed = val.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    trimmed = trimmed.slice(1, -1);
  }
  return trimmed.trim();
}

/**
 * Appends a new user lead record into the connected Google Sheet.
 * @param name The user's full name.
 * @param email The user's email address.
 * @param inquiry The user's query or message.
 */
export async function appendUserRowToSheet(
  name: string,
  email: string,
  inquiry: string
) {
  try {
    const rawEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const rawSpreadsheetId = process.env.GOOGLE_SHEET_ID;

    const emailAddress = sanitizeEnvVar(rawEmail);
    const privateKey = sanitizeEnvVar(rawPrivateKey);
    const spreadsheetId = sanitizeEnvVar(rawSpreadsheetId);

    if (!emailAddress || !privateKey || !spreadsheetId) {
      console.error(
        "Google Sheets credentials are not fully configured in environment variables."
      );
      return {
        success: false,
        error: "Google Sheets credentials are not fully configured.",
      };
    }

    // Format the private key to handle newline characters properly
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");

    // Initialize Google JWT client with options object constructor
    const auth = new google.auth.JWT({
      email: emailAddress,
      key: formattedPrivateKey,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    // Explicitly authorize before making request to ensure access token is generated
    await auth.authorize();

    const sheets = google.sheets({ version: "v4" });

    // Append user details as a new row: [Index (B), Time (C), Name (D), Email (E), Query (F)]
    // Using range "B:F" targets those columns and appends to the first available row.
    const response = await sheets.spreadsheets.values.append({
      auth, // Pass authorized client explicitly
      spreadsheetId,
      range: "B:F",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          ["=ROW()-2", new Date().toLocaleString(), name, email, inquiry],
        ],
      },
    });

    return { success: true, status: response.status };
  } catch (error: any) {
    console.error("Error writing to Google Sheet:", error);
    return {
      success: false,
      error: error.message || "Failed to save data to Google Sheets",
    };
  }
}
