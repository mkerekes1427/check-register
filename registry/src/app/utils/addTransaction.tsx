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

      console.log(formValues);

      const rowNum = (getRes.data.values?.length as number) + 1;

      const checkNo = 100;
      const transactionType: string = "Debit";
      const amount: number = 970;
      const date = "2024-05-01";
      const description = "Walmart";
      const category = "Groceries";

      const prevTotal = parseInt(getRes.data.values?.[rowNum - 2][6], 10) as number;

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