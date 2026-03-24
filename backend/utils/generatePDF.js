const { jsPDF } = require('jspdf');
require('jspdf-autotable');

const generateInvoicePDF = (order, type) => {
    const doc = new jsPDF();

    doc.text(`${type} Invoice`, 14, 20);
    doc.setFontSize(10);
    doc.text(`Order ID: ${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 36);

    const tableData = order.products.map(item => [
        item.product.name,
        item.quantity,
        item.sellingPrice || item.costPrice,
        (item.quantity * (item.sellingPrice || item.costPrice)).toFixed(2)
    ]);

    doc.autoTable({
        startY: 45,
        head: [['Product', 'Quantity', 'Price', 'Total']],
        body: tableData,
    });

    doc.text(`Total Amount: ₹${order.totalAmount}`, 14, doc.autoTable.previous.finalY + 10);

    return doc.output('arraybuffer'); // Return buffer to send as response
};

module.exports = { generateInvoicePDF };
