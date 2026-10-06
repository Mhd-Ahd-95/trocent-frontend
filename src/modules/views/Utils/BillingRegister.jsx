

export const downloadExcel = async (rows, auditNumber) => {
    const XLSX = await import('xlsx');
    const header = ['Customer Number', 'Order Number', 'Invoice Date', 'Sub Total', 'Federal Tax', 'Provincial Tax', 'Grand Total'];
    const toYYMMDD = (d) => (d ? `${d.slice(2, 4)}${d.slice(5, 7)}${d.slice(8, 10)}` : '');
    const body = rows.map((r) => [
        r.customer_number,
        r.order_number,
        toYYMMDD(r.billing_invoice_date),
        Number(r.sub_total) || 0,
        Number(r.federal_tax) || 0,
        Number(r.provincial_tax) || 0,
        Number(r.grand_total) || 0,
    ]);
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);
    for (let R = 1; R <= body.length; R++) {
        for (let C = 3; C <= 6; C++) {
            const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
            if (cell) cell.z = '#,##0.00';
        }
    }
    ws['!cols'] = [{ wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 14 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Billing Register');
    XLSX.writeFile(wb, `BillingRegister${auditNumber}.xlsx`);
}