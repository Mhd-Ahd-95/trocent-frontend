import jsPDF from 'jspdf';
import moment from 'moment';

export const generateBillOfLadingPDF = async (data) => {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    let yPos = margin;

    const drawBox = (x, y, width, height, fill = false) => {
        pdf.setDrawColor(204, 204, 204);
        if (fill) {
            pdf.setFillColor(224, 224, 224);
            pdf.rect(x, y, width, height, 'FD');
        } else {
            pdf.rect(x, y, width, height);
        }
    };

    let headerYPos = yPos;

    try {
        const img = new Image();
        img.src = '/assets/logo-messagers.png';
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        pdf.addImage(img, 'PNG', margin, headerYPos, 70, 10);
    } catch (error) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MESSAGERS', margin, headerYPos + 5);
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('STRAIGHT BILL OF LADING', pageWidth - margin, headerYPos + 5, { align: 'right' });

    headerYPos += 15;

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data?.receiver_address || '', margin, headerYPos);
    headerYPos += 4;
    pdf.text(`${data?.receiver_city || ''}, ${data?.receiver_province || ''}, ${data?.receiver_postal_code || ''}`, margin, headerYPos);
    headerYPos += 4;
    pdf.text(`TEL. ${data?.receiver_phone_number || ''}`, margin, headerYPos);

    //
    let rightYPos = yPos + 12;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ORDER NUMBER:', pageWidth - margin, rightYPos, { align: 'right' });

    rightYPos += 5;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(data?.order_number || ''), pageWidth - margin, rightYPos, { align: 'right' });

    rightYPos += 5;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    const dateLabelText = 'DATE: ';
    const dateLabelWidth = pdf.getTextWidth(dateLabelText);
    const dateValueText = moment(data?.create_date).format('YYYY-MM-DD');
    const dateValueWidth = pdf.getTextWidth(dateValueText);
    const totalDateWidth = dateLabelWidth + dateValueWidth;


    const dateStartX = pageWidth - margin - totalDateWidth;
    pdf.text('DATE:', dateStartX, rightYPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(dateValueText, dateStartX + dateLabelWidth, rightYPos);

    yPos = Math.max(headerYPos, rightYPos) + 5;


    pdf.setDrawColor(221, 145, 0);
    pdf.setLineWidth(0.8);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    pdf.setDrawColor(204, 204, 204);
    pdf.setLineWidth(0.1);

    yPos += 6;


    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CLIENT:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(data.customer_number || 'N/A'), margin + 15, yPos);

    pdf.setFont('helvetica', 'bold');
    pdf.text('REFERENCE:', pageWidth / 2 + 10, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data?.references && data.references.length > 0 ? data.references[0] : 'N/A', pageWidth / 2 + 32, yPos);

    yPos += 10;


    const boxWidth = (pageWidth - 2 * margin - 5) / 2;
    const boxHeight = 28;


    drawBox(margin, yPos, boxWidth, boxHeight);
    drawBox(margin, yPos, boxWidth, 5, true);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SHIPPER', margin + 1, yPos + 3.5);

    pdf.setFontSize(7);
    let tempY = yPos + 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.shipper_name || '', margin + 1, tempY);
    tempY += 3.5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.shipper_address || '', margin + 1, tempY);
    tempY += 3.5;
    pdf.text(data.shipper_city || '', margin + 1, tempY);
    tempY += 3.5;
    pdf.text(data.shipper_province || '', margin + 1, tempY);
    tempY += 3.5;
    pdf.text(data.shipper_postal_code || '', margin + 1, tempY);


    const receiverX = margin + boxWidth + 5;
    drawBox(receiverX, yPos, boxWidth, boxHeight);
    drawBox(receiverX, yPos, boxWidth, 5, true);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('RECEIVER:', receiverX + 1, yPos + 3.5);

    tempY = yPos + 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.receiver_name || '', receiverX + 1, tempY);
    tempY += 3.5;
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.receiver_address || '', receiverX + 1, tempY);
    tempY += 3.5;
    pdf.text(data.receiver_city || '', receiverX + 1, tempY);
    tempY += 3.5;
    pdf.text(data.receiver_province || '', receiverX + 1, tempY);
    tempY += 3.5;
    pdf.text(data.receiver_postal_code || '', receiverX + 1, tempY);

    yPos += boxHeight + 5;


    const instructionHeight = 12;


    drawBox(margin, yPos, boxWidth, instructionHeight);
    drawBox(margin, yPos, boxWidth, 4, true);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('SPECIAL INSTRUCTIONS', margin + 1, yPos + 3);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    const pickupInst = pdf.splitTextToSize(data.pickup_special_instructions || '', boxWidth - 2);
    pdf.text(pickupInst, margin + 1, yPos + 7);


    drawBox(receiverX, yPos, boxWidth, instructionHeight);
    drawBox(receiverX, yPos, boxWidth, 4, true);
    pdf.setFont('helvetica', 'bold');
    pdf.text('SPECIAL INSTRUCTIONS', receiverX + 1, yPos + 3);
    pdf.setFont('helvetica', 'normal');
    const deliveryInst = pdf.splitTextToSize(data.delivery_special_instructions || '', boxWidth - 2);
    pdf.text(deliveryInst, receiverX + 1, yPos + 7);

    yPos += instructionHeight + 3;


    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.4);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    pdf.setDrawColor(204, 204, 204);
    pdf.setLineWidth(0.1);

    yPos += 3;


    pdf.setFontSize(6.5);
    const totalTableWidth = pageWidth - 2 * margin;
    const colWidths = [30, 45, 18, 25, 28, 30];
    const tableStartX = margin;


    drawBox(tableStartX, yPos, totalTableWidth, 5, true);
    let xPos = tableStartX;

    const headers = ['FREIGHT TYPE', 'DESCRIPTION', 'PIECES', 'ACTUAL WEIGHT', 'CHARGEABLE WEIGHT', 'DIMENSIONS'];
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, i) => {
        pdf.setDrawColor(204, 204, 204);
        pdf.text(header, xPos + 1, yPos + 3.5);
        if (i < headers.length - 1) {
            pdf.line(xPos + colWidths[i], yPos, xPos + colWidths[i], yPos + 5);
        }
        xPos += colWidths[i];
    });

    yPos += 5;


    pdf.setFont('helvetica', 'normal');
    if (data.freights && data.freights.length > 0) {
        data.freights.forEach((item, idx) => {
            const rowHeight = 7;
            pdf.setDrawColor(204, 204, 204);
            drawBox(tableStartX, yPos, totalTableWidth, rowHeight);

            xPos = tableStartX;
            const rowData = [
                item.type || '',
                item.description || '',
                String(item.pieces || 0),
                `${item.weight || 0} ${item.unit || ''}`,
                `${item.volume_weight || 0} ${item.unit || ''}`,
                `${item.length || 0} X ${item.width || 0} X ${item.height || 0}`
            ];

            rowData.forEach((text, i) => {
                const textLines = pdf.splitTextToSize(text, colWidths[i] - 2);
                if (i === 2 || i === 3 || i === 4) {
                    pdf.text(textLines, xPos + colWidths[i] / 2, yPos + 4.5, { align: 'center' });
                } else {
                    pdf.text(textLines, xPos + 1, yPos + 4.5);
                }
                if (i < rowData.length - 1) {
                    pdf.line(xPos + colWidths[i], yPos, xPos + colWidths[i], yPos + rowHeight);
                }
                xPos += colWidths[i];
            });

            yPos += rowHeight;
        });
    }


    pdf.setDrawColor(204, 204, 204);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(tableStartX, yPos, totalTableWidth, 5, 'FD');

    xPos = tableStartX;
    pdf.setFont('helvetica', 'bold');
    pdf.text('TOTALS', xPos + 1, yPos + 3.5);
    xPos += colWidths[0] + colWidths[1];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(String(data.total_pieces || 0), xPos + colWidths[2] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[2];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(String(data.total_actual_weight || 0), xPos + colWidths[3] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[3];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(String(data.total_volume_weight || 0), xPos + colWidths[4] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[4];
    pdf.line(xPos, yPos, xPos, yPos + 5);

    yPos += 8;


    const accessorialHeight = 16;
    drawBox(margin, yPos, pageWidth - 2 * margin, accessorialHeight);
    drawBox(margin, yPos, pageWidth - 2 * margin, 4, true);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('ACCESSORIALS', margin + 1, yPos + 3);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    let accY = yPos + 7;
    const accessorials = (data.customer_accessorials || []).filter(acc => acc.is_included).concat(data.additional_service_charges || []);
    accessorials.forEach((a) => {
        pdf.text(`${a.charge_amount || ''} X ${a.charge_name || ''}`, margin + 1, accY);
        accY += 3.5;
    });

    yPos += accessorialHeight + 5;


    const dateBoxHeight = 13;


    drawBox(margin, yPos, boxWidth, dateBoxHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('PICKUP DATE', margin + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.pickup_date ? moment(data.pickup_date).format('YYYY-MM-DD') : 'N/A', margin + 1, yPos + 8);
    pdf.setFontSize(7);
    pdf.text(`TIME IN: ${data.pickup_in || '00:00'} TIME OUT: ${data.pickup_out || '00:00'}`, margin + 1, yPos + 11);


    drawBox(receiverX, yPos, boxWidth, dateBoxHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text('DELIVERY DATE', receiverX + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.delivery_date ? moment(data.delivery_date).format('YYYY-MM-DD') : 'N/A', receiverX + 1, yPos + 8);
    pdf.setFontSize(7);
    pdf.text(`TIME IN: ${data.delivery_in || '00:00'} TIME OUT: ${data.delivery_out || '00:00'}`, receiverX + 1, yPos + 11);

    yPos += dateBoxHeight + 5;


    const signatureHeight = 13;


    drawBox(margin, yPos, boxWidth, signatureHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text('SHIPPED IN GOOD ORDER BY:', margin + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Signature', margin + 1, yPos + 10);


    drawBox(receiverX, yPos, boxWidth, signatureHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECEIVED IN GOOD ORDER BY:', receiverX + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Signature', receiverX + 1, yPos + 10);

    yPos += signatureHeight + 5;


    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    const notice = pdf.splitTextToSize(
        'MAXIMUM LIABILITY OF $2.00/LB OR $4.40/KG UNLESS DECLARED VALUE STATES OTHERWISE NOTICE OF CLAIM MUST BE SUBMITTED IN WRITING WITHIN 24 HOURS OF DELIVERY.',
        pageWidth - 2 * margin
    );
    pdf.text(notice, margin, yPos);

    yPos += 6;


    pdf.setDrawColor(204, 204, 204);
    pdf.setLineWidth(0.1);
    pdf.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 3;


    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    const poweredByText = 'POWERED BY ';
    const iamText = 'IAM INC';

    pdf.setTextColor(0, 0, 0);
    const poweredByWidth = pdf.getTextWidth(poweredByText);
    const iamWidth = pdf.getTextWidth(iamText);
    const totalWidth = poweredByWidth + iamWidth;
    const startX = (pageWidth - totalWidth) / 2;

    pdf.text(poweredByText, startX, yPos);


    pdf.setTextColor(0, 0, 255);
    const link = pdf.textWithLink(iamText, startX + poweredByWidth, yPos, { url: 'https://www.iamcorp.ca/' });
    pdf.setTextColor(0, 0, 0);

    return pdf;
};