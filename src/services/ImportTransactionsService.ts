// exemple: https://www.notion.so/Importando-arquivos-CSV-com-Node-js-2172338480cb47e28a5d3ed9981c38a0
import csvParse from 'csv-parse';
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(file: string): Promise<Request[]> {
    const csvData: Request[] = [];

    const createTransaction = new CreateTransactionService();

    const cvsTransactions = fs.createReadStream(file).pipe(
      csvParse({
        from_line: 2,
        columns: ['title', 'type', 'value', 'category'],
        trim: true,
        skip_empty_lines: true,
      })
        .on('data', transaction => {
          csvData.push(transaction);
        })
        .on('data', () => {
          csvData.map(async transaction => {
            await createTransaction.execute(transaction);
          });
        }),
    );

    await new Promise(resolve => cvsTransactions.on('end', resolve));
    await fs.promises.unlink(file);

    return csvData;
  }
}

export default ImportTransactionsService;
