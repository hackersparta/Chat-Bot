import { Parser } from 'json2csv';
import fs from 'fs';
import path from 'path';

export class ReportService {
    public async generateOrderReport(orders: any[]): Promise<string> {
        try {
            if (!orders || orders.length === 0) {
                // Mock data if empty
                orders = [
                    { id: '101', customer: 'Alice', item: 'Iron Tawa', status: 'Delivered', price: 1200 },
                    { id: '102', customer: 'Bob', item: 'Curd Pot', status: 'Shipped', price: 450 },
                ];
            }

            const fields = ['id', 'customer', 'item', 'status', 'price'];
            const opts = { fields };
            const parser = new Parser(opts);
            const csv = parser.parse(orders);

            const filePath = path.join(__dirname, '../../reports', `orders_${Date.now()}.csv`);

            // Ensure directory exists
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(filePath, csv);
            return filePath;
        } catch (err) {
            console.error(err);
            throw new Error('CSV Generation Failed');
        }
    }
}
