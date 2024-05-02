'use server';
import { google } from 'googleapis';
import { GoogleAuth, OAuth2Client } from 'google-auth-library';
import { registryForm } from '../types/types';

export default async function addTransaction(formValues: registryForm) {
  
  const stringVersion = Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS as string, "base64").toString("utf-8");
  const credsJSON = JSON.parse(stringVersion);

  const manualAuth = new GoogleAuth({
    credentials: credsJSON,
    scopes: 'https://www.googleapis.com/auth/spreadsheets'
  });

  const client = await manualAuth.getClient();

  const sheets = google.sheets({version: "v4", auth:client as OAuth2Client});

  const getRes = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: "Sheet1"
  });

  const rowNum = (getRes.data.values?.length as number) + 1;

  const checkNo = formValues.checkNo;
  const transactionType = formValues.transaction;
  const amount: number = Math.floor(parseFloat(formValues.amount) * 100) / 100;
  const date = formValues.date;
  const description = formValues.description;
  const category = formValues.category;

  const prevTotal = parseFloat(getRes.data.values?.[rowNum - 2][6]) as number;

  const total = transactionType === "Debit" ? prevTotal - amount : prevTotal + amount;

  const newRow = [[checkNo, transactionType, amount, date, description, category, total]];

  try {
    const postRes = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SHEET_ID,
        range: `Sheet1!A${rowNum}:G${rowNum}`,
        valueInputOption: "RAW",
        requestBody: {
            values: newRow
        }
    })

    return true;
  }
  catch (e) {
      console.log(e);
      return false;
  }

}