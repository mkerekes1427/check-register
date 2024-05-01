'use server';
import { google } from 'googleapis';
import { registryForm } from '../types/types';

export default async function addTransaction(formValues: registryForm) {
   
    const auth = await google.auth.getClient({
        scopes: [
          'https://www.googleapis.com/auth/spreadsheets',
        ]
      })

      const sheets = google.sheets({version: "v4", auth})

      const getRes = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range: "Sheet1"
      });

      console.log(`Sheet id is ${process.env.SHEET_ID}`);
      console.log(`credentials are ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);

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