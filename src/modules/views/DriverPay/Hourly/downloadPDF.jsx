import jsPDF from 'jspdf';

const COLORS = {
    orange: [237, 125, 49],
    orangeBorder: [221, 145, 0],
    blue: [68, 114, 196],
    lightOrange: [252, 228, 214],
    lightGray: [224, 224, 224],
    border: [0, 0, 0],
    disabled: [230, 230, 230],
    white: [255, 255, 255],
    black: [0, 0, 0]
};

const timeToSeconds = (timeStr) => {
    if (!timeStr) return 0;
    const [h, m, s] = timeStr.split(':').map(Number);
    return h * 3600 + m * 60 + (s || 0);
};

const secondsToTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const formatDate = (isoString) => (isoString ? isoString.split('T')[0] : '');

const formatClockTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toISOString().substr(11, 8);
};

const getGpsDifference = (kmDriven, mileageAllotment) => {
    const km = kmDriven || 0;
    const limit = mileageAllotment || 0;
    return km > limit ? km - limit : 0;
};

export const generateDriverPayHourlyPDF = async (company) => {

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 12;
    const footerHeight = 10;
    const maxContentHeight = pageHeight - margin - footerHeight;
    let yPos = margin;

    const addFooter = () => {
        const footerY = pageHeight - footerHeight;

        pdf.setDrawColor(...COLORS.orangeBorder);
        pdf.setLineWidth(0.8);
        pdf.line(margin, footerY, pageWidth - margin, footerY);

        const poweredY = footerY + 5;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        const poweredByText = 'POWERED BY ';
        const iamText = 'IAM INC';

        pdf.setTextColor(0, 0, 0);
        const poweredByWidth = pdf.getTextWidth(poweredByText);
        const totalWidth = poweredByWidth + pdf.getTextWidth(iamText);
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

    const drawBox = (x, y, width, height, fillColor = null) => {
        pdf.setDrawColor(...COLORS.border);
        if (fillColor) {
            pdf.setFillColor(...fillColor);
            pdf.rect(x, y, width, height, 'FD');
        } else {
            pdf.rect(x, y, width, height);
        }
    };

    const drawRowCells = (x, y, rowHeight, colWidths, values, opts = {}) => {
        const { bold = false, fontSize = 7, textColor = COLORS.black, align = [], centerCols = [] } = opts;
        let xPos = x;
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(fontSize);
        pdf.setTextColor(...textColor);
        values.forEach((val, i) => {
            const text = String(val ?? '');
            const isCenter = centerCols.includes(i);
            const cellX = isCenter ? xPos + colWidths[i] / 2 : xPos + 1.5;
            const alignOpt = isCenter ? { align: 'center' } : {};
            const lines = pdf.splitTextToSize(text, colWidths[i] - 2);
            pdf.text(lines, cellX, y + rowHeight / 2 + 1.2, alignOpt);
            if (i < values.length - 1) {
                pdf.setDrawColor(...COLORS.border);
                pdf.line(xPos + colWidths[i], y, xPos + colWidths[i], y + rowHeight);
            }
            xPos += colWidths[i];
        });
        pdf.setTextColor(...COLORS.black);
    };

    const titleHeight = 16;
    drawBox(margin, yPos, pageWidth - margin * 2, titleHeight, COLORS.blue);
    pdf.setTextColor(...COLORS.white);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text(company.operating_name || '', pageWidth / 2, yPos + 7, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...COLORS.disabled);
    pdf.text(company.legal_name || '', pageWidth / 2, yPos + 13, { align: 'center' });
    pdf.setTextColor(...COLORS.black);
    yPos += titleHeight + 6;

    const driverTotals = company.drivers.map(driver => {
        let driverSeconds = 0;
        let driverExtraKm = 0;
        driver.days.forEach(day => {
            driverSeconds += timeToSeconds(day.clocked_hours);
            driverExtraKm += getGpsDifference(day.km_driven, driver.mileage_allotment);
        });
        return { driver, driverSeconds, driverExtraKm };
    });
    const totalSeconds = driverTotals.reduce((s, d) => s + d.driverSeconds, 0);
    const totalExtraKm = driverTotals.reduce((s, d) => s + d.driverExtraKm, 0);

    const labelHeight = 6;
    checkAddPage(labelHeight + 5 * (driverTotals.length + 2));

    const summaryColWidths = [55, 55, 55];
    const summaryTableWidth = summaryColWidths.reduce((a, b) => a + b, 0);
    const summaryRowHeight = 6;

    checkAddPage(summaryRowHeight * (driverTotals.length + 2));

    drawBox(margin, yPos, summaryTableWidth, summaryRowHeight, COLORS.blue);
    drawRowCells(margin, yPos, summaryRowHeight, summaryColWidths, ['Total per Drivers', 'Hours', 'Extra KM'], { bold: true, textColor: COLORS.white, fontSize: 10 });
    yPos += summaryRowHeight;

    driverTotals.forEach(({ driver, driverSeconds, driverExtraKm }) => {
        checkAddPage(summaryRowHeight);
        drawBox(margin, yPos, summaryTableWidth, summaryRowHeight);
        drawRowCells(margin, yPos, summaryRowHeight, summaryColWidths, [driver.driver_number, secondsToTime(driverSeconds), `${driverExtraKm} KM`], { bold: true, fontSize: 8, });
        yPos += summaryRowHeight;
    });

    checkAddPage(summaryRowHeight);
    drawBox(margin, yPos, summaryTableWidth, summaryRowHeight, COLORS.lightOrange);
    drawRowCells(margin, yPos, summaryRowHeight, summaryColWidths, ['Totals', secondsToTime(totalSeconds), `${totalExtraKm} KM`], { bold: true, fontSize: 8 });
    yPos += summaryRowHeight + 8;

    const driverFields = ['Date', 'Clock In', 'Consignee City', 'Clock Out', 'Last Delivery', 'Clocked Hours', 'Adjustment (hrs)', 'GPS', 'GPS - Difference', 'OBS'];
    const dayColWidths = [20, 18, 30, 18, 20, 22, 30, 16, 30, 49];
    const centerCols = [1, 3, 5, 6, 7, 8];
    const dayTableWidth = dayColWidths.reduce((a, b) => a + b, 0);
    const dayRowHeight = 6;

    driverTotals.forEach(({ driver }) => {
        const driverHeaderHeight = 6;
        checkAddPage(driverHeaderHeight * 2 + dayRowHeight * (driver.days.length + 1) + 8);
        const driverColWidths = [40, 40];
        drawBox(margin, yPos, driverColWidths[0] + driverColWidths[1], driverHeaderHeight, COLORS.blue);
        drawRowCells(margin, yPos, driverHeaderHeight, driverColWidths, ['Driver', 'KM Limite'], { bold: true, textColor: COLORS.white, fontSize: 10 });
        yPos += driverHeaderHeight;

        drawBox(margin, yPos, driverColWidths[0] + driverColWidths[1], driverHeaderHeight);
        drawRowCells(margin, yPos, driverHeaderHeight, driverColWidths, [driver.driver_number, driver.mileage_allotment], { bold: true, fontSize: 8 });
        yPos += driverHeaderHeight;

        checkAddPage(dayRowHeight);
        drawBox(margin, yPos, dayTableWidth, dayRowHeight, COLORS.blue, { bold: true, textColor: COLORS.white, fontSize: 10 });
        drawRowCells(margin, yPos, dayRowHeight, dayColWidths, driverFields, { bold: true, fontSize: 8, textColor: COLORS.white, centerCols });
        yPos += dayRowHeight;

        driver.days.forEach(day => {
            checkAddPage(dayRowHeight);
            const gpsDiff = getGpsDifference(day.km_driven, driver.mileage_allotment);
            drawBox(margin, yPos, dayTableWidth, dayRowHeight);
            drawRowCells(margin, yPos, dayRowHeight, dayColWidths, [
                formatDate(day.date),
                formatClockTime(day.clock_in),
                day.consignee_city || '',
                formatClockTime(day.clock_out),
                day.last_delivery || '',
                day.clocked_hours || '',
                day.hour_adjustment || '',
                day.km_driven != null ? `${day.km_driven} KM` : '',
                gpsDiff ? `${gpsDiff} KM` : '',
                day.note || ''
            ], { bold: true, fontSize: 8, centerCols });
            yPos += dayRowHeight;
        });

        yPos += 8;
    });

    addFooter();

    return pdf;
};