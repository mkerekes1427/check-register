import { Dayjs } from 'dayjs';

export type registryForm = {
    checkNo: string,
    transaction: string,
    amount: string,
    date: Dayjs | null,
    description: string,
    category: string,
    submitted: boolean,
    error: boolean
  }