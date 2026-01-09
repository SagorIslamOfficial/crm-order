import type { Order } from '../types';

interface OrderPrintTemplateProps {
    order: Order;
    printCopyType: 'customer' | 'office' | 'tailor' | null;
}

export function OrderPrintTemplate({
    order,
    printCopyType,
}: OrderPrintTemplateProps) {
    if (!printCopyType) return null;

    return (
        <div
            className={`print-content hidden print:block ${printCopyType === 'tailor' ? 'print-tailor-copy' : ''}`}
        >
            {/* Company Header */}
            <div className="print-header">
                <h1>Platinumys Fashion</h1>
                <p>123 Fashion Street, Dhaka, Bangladesh</p>
                <p>Phone: +880 1234-567890</p>
            </div>

            {/* Copy Type Badge */}
            <div className="print-copy-type">
                {printCopyType.toUpperCase()} COPY
            </div>

            {/* Order Header */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Order: {order.order_number}</h2>
                <p>
                    Order Date:{' '}
                    {new Date(order.created_at).toLocaleDateString()}
                </p>
                <p>
                    Delivery Date:{' '}
                    {new Date(order.delivery_date).toLocaleDateString()}
                </p>
            </div>

            {/* Customer & Shop Details */}
            <div className="print-details-grid">
                <div className="print-details-section">
                    <h2>Customer Information</h2>
                    <p>
                        <strong>Name:</strong> {order.customer.name}
                    </p>
                    <p>
                        <strong>Phone:</strong> {order.customer.phone}
                    </p>
                    {order.customer.address && (
                        <p>
                            <strong>Address:</strong> {order.customer.address}
                        </p>
                    )}
                </div>
                <div className="print-details-section">
                    <h2>Shop Information</h2>
                    <p>
                        <strong>Shop:</strong> {order.shop.name}
                    </p>
                    <p>
                        <strong>Address:</strong> {order.shop.address}
                    </p>
                    <p>
                        <strong>Phone:</strong> {order.shop.phone}
                    </p>
                </div>
            </div>

            {order.delivery_address && (
                <div style={{ marginBottom: '20px' }}>
                    <strong>Delivery Address:</strong> {order.delivery_address}
                </div>
            )}

            {/* Order Items Table */}
            <div style={{ marginBottom: '20px' }}>
                <h2>Order Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Size</th>
                            <th>Quantity</th>
                            {printCopyType !== 'tailor' && (
                                <>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </>
                            )}
                            <th>Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product_type.name}</td>
                                <td>{item.product_size.size_label}</td>
                                <td>{item.quantity}</td>
                                {printCopyType !== 'tailor' && (
                                    <>
                                        <td>৳{item.price}</td>
                                        <td>৳{item.line_total}</td>
                                    </>
                                )}
                                <td>{item.notes || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Payment Summary - Hide for Tailor Copy */}
            {printCopyType !== 'tailor' && (
                <div className="print-summary">
                    <div className="print-summary-row">
                        <span className="print-summary-label">
                            Total Amount:
                        </span>
                        <span>৳{order.total_amount}</span>
                    </div>
                    {parseFloat(order.discount_amount) > 0 && (
                        <div className="print-summary-row">
                            <span className="print-summary-label">
                                Discount{' '}
                                {order.discount_type === 'percentage'
                                    ? '(%)'
                                    : '(Fixed)'}
                                :
                            </span>
                            <span>-৳{order.discount_amount}</span>
                        </div>
                    )}
                    <div className="print-summary-row">
                        <span className="print-summary-label">Paid:</span>
                        <span>৳{order.advance_paid}</span>
                    </div>
                    <div className="print-summary-row print-total">
                        <span className="print-summary-label">Due Amount:</span>
                        <span>৳{order.due_amount}</span>
                    </div>
                </div>
            )}

            {/* Signatures */}
            <div className="print-signatures">
                <div className="print-signature">
                    <div className="print-signature-line">
                        Customer Signature
                    </div>
                </div>
                <div className="print-signature">
                    <div className="print-signature-line">Authorized By</div>
                </div>
                <div className="print-signature">
                    <div className="print-signature-line">Received By</div>
                </div>
            </div>

            {/* Footer */}
            <div className="print-footer">
                <p>
                    Thank you for your business! For any queries, contact us at
                    info@platinumysfashion.com
                </p>
                <p>This is a computer-generated document.</p>
            </div>
        </div>
    );
}
