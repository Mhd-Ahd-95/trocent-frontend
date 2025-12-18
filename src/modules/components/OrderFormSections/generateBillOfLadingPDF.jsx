import jsPDF from 'jspdf';
import moment from 'moment';
import CustomersApi from '../../apis/Customers.api';

const translations = {
    en: {
        title: 'STRAIGHT BILL OF LADING',
        orderNumber: 'ORDER NUMBER:',
        date: 'DATE:',
        client: 'CLIENT:',
        reference: 'REFERENCE:',
        shipper: 'SHIPPER',
        receiver: 'RECEIVER',
        specialInstructions: 'SPECIAL INSTRUCTIONS',
        freightType: 'FREIGHT TYPE',
        description: 'DESCRIPTION',
        pieces: 'PIECES',
        actualWeight: 'ACTUAL WEIGHT',
        chargeableWeight: 'CHARGEABLE WEIGHT',
        dimensions: 'DIMENSIONS',
        totals: 'TOTALS',
        accessorials: 'ACCESSORIALS',
        pickupDate: 'PICKUP DATE',
        deliveryDate: 'DELIVERY DATE',
        timeIn: 'TIME IN:',
        timeOut: 'TIME OUT:',
        shippedBy: 'SHIPPED IN GOOD ORDER BY:',
        receivedBy: 'RECEIVED IN GOOD ORDER BY:',
        signature: '',
        liabilityNotice: 'MAXIMUM LIABILITY OF $2.00/LB OR $4.40/KG UNLESS DECLARED VALUE STATES OTHERWISE.',
        liabilityNotice2: 'NOTICE OF CLAIM MUST BE SUBMITTED IN WRITING WITHIN 24 HOURS OF DELIVERY.',
        poweredBy: 'POWERED BY '
    },
    fr: {
        title: 'CONNAISSEMENT DIRECT',
        orderNumber: 'NUMÉRO DE COMMANDE:',
        date: 'DATE:',
        client: 'CLIENT:',
        reference: 'RÉFÉRENCE:',
        shipper: 'EXPÉDITEUR',
        receiver: 'DESTINATAIRE:',
        specialInstructions: 'INSTRUCTIONS SPÉCIALES',
        freightType: 'TYPE DE FRET',
        description: 'DESCRIPTION',
        pieces: 'PIÈCES',
        actualWeight: 'POIDS RÉEL',
        chargeableWeight: 'POIDS FACTURABLE',
        dimensions: 'DIMENSIONS',
        totals: 'TOTAUX',
        accessorials: 'ACCESSOIRES',
        pickupDate: 'DATE DE RAMASSAGE',
        deliveryDate: 'DATE DE LIVRAISON',
        timeIn: 'HEURE D\'ENTRÉE:',
        timeOut: 'HEURE DE SORTIE:',
        shippedBy: 'EXPÉDIÉ EN BON ÉTAT PAR:',
        receivedBy: 'REÇU EN BON ÉTAT PAR:',
        signature: '',
        liabilityNotice: 'RESPONSABILITÉ MAXIMALE DE 2,00 $/LB OU 4,40 $/KG SAUF INDICATION CONTRAIRE DE LA VALEUR DÉCLARÉE.',
        liabilityNotice2: 'L\'AVIS DE RÉCLAMATION DOIT ÊTRE SOUMIS PAR ÉCRIT DANS LES 24 HEURES SUIVANT LA LIVRAISON.',
        poweredBy: 'PROPULSÉ PAR '
    }
};

export const generateBillOfLadingPDF = async (data, language = 'en') => {
    const t = translations[language] || translations.en;
    const { messagers } = data

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 10;
    const maxContentHeight = pageHeight - margin - footerHeight;
    let yPos = margin;

    const addFooter = () => {
        const footerY = pageHeight - footerHeight;

        pdf.setDrawColor(204, 204, 204);
        pdf.setLineWidth(0.1);
        pdf.line(margin, footerY, pageWidth - margin, footerY);

        const poweredY = footerY + 5;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        const poweredByText = t.poweredBy;
        const iamText = 'IAM INC';

        pdf.setTextColor(0, 0, 0);
        const poweredByWidth = pdf.getTextWidth(poweredByText);
        const iamWidth = pdf.getTextWidth(iamText);
        const totalWidth = poweredByWidth + iamWidth;
        const startX = (pageWidth - totalWidth) / 2;

        pdf.text(poweredByText, startX, poweredY);

        pdf.setTextColor(0, 0, 255);
        pdf.textWithLink(iamText, startX + poweredByWidth, poweredY, { url: 'https://www.iamcorp.ca/' });
        pdf.setTextColor(0, 0, 0);
    };

    const checkAddPage = (requiredHeight) => {
        if (yPos + requiredHeight > maxContentHeight) {
            addFooter();
            pdf.addPage();
            yPos = margin;
            return true;
        }
        return false;
    };

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
        let src = '/assets/logo-messagers.png';
        if (data.customer_id) {
            const logo = await CustomersApi.getLogo(data.customer_id)
            const contentType = logo.headers['content-type'];
            if (contentType && contentType.startsWith('image/')) {
                const blob = new Blob([logo.data], { type: contentType })
                const url = URL.createObjectURL(blob)
                src = url
            }
        }
        img.src = src
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        pdf.addImage(img, 'PNG', margin, headerYPos, 70, 10);
        if (src !== '/assets/logo-messagers.png') {
            URL.revokeObjectURL(src);
        }
    } catch (error) {
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('MESSAGERS', margin, headerYPos + 5);
    }

    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(t.title, pageWidth - margin, headerYPos + 5, { align: 'right' });

    headerYPos += 15;

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.text(messagers?.address || '', margin, headerYPos);
    headerYPos += 4;
    pdf.text(`${messagers?.city || ''}, ${messagers?.province || ''}, ${messagers?.postal_code || ''}`, margin, headerYPos);
    headerYPos += 4;
    pdf.text(`TEL. ${messagers?.phone_number || ''}`, margin, headerYPos);

    let rightYPos = yPos + 12;
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    const orderNumberLabelText = t.orderNumber + ' '
    const orderNumberLabelWidth = pdf.getTextWidth(orderNumberLabelText)
    const orderNumberValue = String(data?.order_number)
    const orderNumberValueWidth = pdf.getTextWidth(orderNumberValue)
    const totalOrderNumberWidth = orderNumberLabelWidth + orderNumberValueWidth
    const orderNumberStartX = pageWidth - margin - totalOrderNumberWidth
    pdf.text(orderNumberLabelText, orderNumberStartX, rightYPos);
    pdf.setFont('helvetica', 'normal')
    pdf.text(orderNumberValue, orderNumberStartX + orderNumberLabelWidth, rightYPos)

    // rightYPos += 5;
    // pdf.setFontSize(8);
    // pdf.setFont('helvetica', 'normal');
    // pdf.text(String(data?.order_number || ''), pageWidth - margin, rightYPos, { align: 'right' });

    rightYPos += 5;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    const dateLabelText = t.date + ' ';
    const dateLabelWidth = pdf.getTextWidth(dateLabelText);
    const dateValueText = moment(data?.create_date).format('YYYY-MM-DD');
    const dateValueWidth = pdf.getTextWidth(dateValueText);
    const totalDateWidth = dateLabelWidth + dateValueWidth;

    const dateStartX = pageWidth - margin - totalDateWidth;
    pdf.text(t.date, dateStartX, rightYPos);
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
    pdf.text(t.client, margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(data.customer_number || 'N/A'), margin + 15, yPos);

    pdf.setFont('helvetica', 'bold');
    pdf.text(t.reference, pageWidth / 2 + 10, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data?.reference_numbers && data.reference_numbers.length > 0 ? data.reference_numbers[0] : 'N/A', pageWidth / 2 + 32, yPos);

    yPos += 10;

    const boxWidth = (pageWidth - 2 * margin - 5) / 2;
    const boxHeight = 28;

    checkAddPage(boxHeight + 5);

    drawBox(margin, yPos, boxWidth, boxHeight);
    drawBox(margin, yPos, boxWidth, 5, true);
    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'bold');
    pdf.text(t.shipper, margin + 1, yPos + 3.5);

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
    pdf.text(t.receiver, receiverX + 1, yPos + 3.5);

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

    checkAddPage(instructionHeight + 5);

    drawBox(margin, yPos, boxWidth, instructionHeight);
    drawBox(margin, yPos, boxWidth, 4, true);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text(t.specialInstructions, margin + 1, yPos + 3);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    const pickupInst = pdf.splitTextToSize(data.pickup_special_instructions || '', boxWidth - 2);
    pdf.text(pickupInst, margin + 1, yPos + 7);

    drawBox(receiverX, yPos, boxWidth, instructionHeight);
    drawBox(receiverX, yPos, boxWidth, 4, true);
    pdf.setFont('helvetica', 'bold');
    pdf.text(t.specialInstructions, receiverX + 1, yPos + 3);
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

    checkAddPage(10);

    drawBox(tableStartX, yPos, totalTableWidth, 5, true);
    let xPos = tableStartX;

    const headers = [t.freightType, t.description, t.pieces, t.actualWeight, t.chargeableWeight, t.dimensions];
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

            checkAddPage(rowHeight);

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

    checkAddPage(8);

    pdf.setDrawColor(204, 204, 204);
    pdf.setFillColor(245, 245, 245);
    pdf.rect(tableStartX, yPos, totalTableWidth, 5, 'FD');

    const unit = data.freights?.length > 0 ? data.freights[0].unit : ''
    xPos = tableStartX;
    pdf.setFont('helvetica', 'bold');
    pdf.text(t.totals, xPos + 1, yPos + 3.5);
    xPos += colWidths[0] + colWidths[1];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(String(data.total_pieces || 0), xPos + colWidths[2] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[2];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(`${String(data.total_actual_weight || 0)} ${unit}`, xPos + colWidths[3] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[3];
    pdf.line(xPos, yPos, xPos, yPos + 5);
    pdf.text(`${String(data.total_volume_weight || 0)} ${unit}`, xPos + colWidths[4] / 2, yPos + 3.5, { align: 'center' });
    xPos += colWidths[4];
    pdf.line(xPos, yPos, xPos, yPos + 5);

    yPos += 8;

    const accessorials = (data.customer_accessorials || []).filter(acc => acc.is_included).concat(data.additional_service_charges || []);
    const lineHeight = 3.5;
    const headerHeight = 4;
    const padding = 3;
    const accessorialContentHeight = accessorials.length > 0 ? (accessorials.length * lineHeight) : lineHeight;
    const accessorialHeight = headerHeight + accessorialContentHeight + padding;

    checkAddPage(accessorialHeight + 5);

    const accessorialBoxStartY = yPos;
    drawBox(margin, accessorialBoxStartY, pageWidth - 2 * margin, accessorialHeight);
    drawBox(margin, accessorialBoxStartY, pageWidth - 2 * margin, headerHeight, true);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(t.accessorials, margin + 1, accessorialBoxStartY + 3);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    let accY = accessorialBoxStartY + headerHeight + 3;

    if (accessorials.length > 0) {
        accessorials.forEach((a) => {
            pdf.text(`${a.charge_amount || ''} X ${a.charge_name || ''}`, margin + 1, accY);
            accY += lineHeight;
        });
    }

    yPos += accessorialHeight + 5;

    const dateBoxHeight = 13;
    checkAddPage(dateBoxHeight + 5);

    drawBox(margin, yPos, boxWidth, dateBoxHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(t.pickupDate, margin + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.pickup_date ? moment(data.pickup_date).format('YYYY-MM-DD') : 'N/A', margin + 1, yPos + 8);
    pdf.setFontSize(7);
    const timeInPLabel = t.timeIn + ' '
    const timeInPWidth = pdf.getTextWidth(timeInPLabel)
    const timeInPValue = data.delivery_in || '00:00'

    const timeOutPLabel = ' ' + t.timeOut + ' '
    const timeOutPValue = data.delivery_out || '00:00'

    let currentPX = margin + 1
    const yPPos2 = yPos + 11

    pdf.setFont('helvetica', 'bold')
    pdf.text(timeInPLabel, currentPX, yPPos2)
    currentPX += pdf.getTextWidth(timeInPLabel)

    pdf.setFont('helvetica', 'normal')
    pdf.text(timeInPValue, currentPX, yPPos2)
    currentPX += pdf.getTextWidth(timeInPValue)

    pdf.setFont('helvetica', 'bold')
    pdf.text(timeOutPLabel, currentPX, yPPos2)
    currentPX += pdf.getTextWidth(timeOutPLabel)

    pdf.setFont('helvetica', 'normal')
    pdf.text(timeOutPValue, currentPX, yPPos2)
    // pdf.text(`${t.timeIn} ${data.pickup_in || '00:00'} ${t.timeOut} ${data.pickup_out || '00:00'}`, margin + 1, yPos + 11);

    drawBox(receiverX, yPos, boxWidth, dateBoxHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(t.deliveryDate, receiverX + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(data.delivery_date ? moment(data.delivery_date).format('YYYY-MM-DD') : 'N/A', receiverX + 1, yPos + 8);
    pdf.setFontSize(7);
    const timeInLabel = t.timeIn + ' '
    const timeInWidth = pdf.getTextWidth(timeInLabel)
    const timeInValue = data.pickup_in || '00:00'

    const timeOutLabel = ' ' + t.timeOut + ' '
    const timeOutValue = data.pickup_out || '00:00'

    let currentX = receiverX + 1
    const yPos2 = yPos + 11

    pdf.setFont('helvetica', 'bold')
    pdf.text(timeInLabel, currentX, yPos2)
    currentX += pdf.getTextWidth(timeInLabel)

    pdf.setFont('helvetica', 'normal')
    pdf.text(timeInValue, currentX, yPos2)
    currentX += pdf.getTextWidth(timeInValue)

    pdf.setFont('helvetica', 'bold')
    pdf.text(timeOutLabel, currentX, yPos2)
    currentX += pdf.getTextWidth(timeOutLabel)

    pdf.setFont('helvetica', 'normal')
    pdf.text(timeOutValue, currentX, yPos2)

    yPos += dateBoxHeight + 5;

    const signatureHeight = 13;
    checkAddPage(signatureHeight + 5);

    drawBox(margin, yPos, boxWidth, signatureHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.text(t.shippedBy, margin + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(t.signature, margin + 1, yPos + 10);

    drawBox(receiverX, yPos, boxWidth, signatureHeight);
    pdf.setFont('helvetica', 'bold');
    pdf.text(t.receivedBy, receiverX + 1, yPos + 4);
    pdf.setFont('helvetica', 'normal');
    pdf.text(t.signature, receiverX + 1, yPos + 10);

    yPos += signatureHeight + 5;

    checkAddPage(12);

    pdf.setFontSize(7);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    const notice = pdf.splitTextToSize(t.liabilityNotice, pageWidth - 2 * margin);
    pdf.text(notice, margin, yPos);
    yPos += 4
    const notice2 = pdf.splitTextToSize(t.liabilityNotice2, pageWidth - 2 * margin);
    pdf.text(notice2, margin, yPos);

    addFooter();

    return pdf;
};