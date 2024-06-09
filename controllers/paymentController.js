// This does not save ANY CC information, and is meant to mock the payment

exports.handlePayment = (req, res) => {
    const { cardNumber, amount } = req.body;

    // Simulate payment processing
    if (cardNumber === "4242 4242 4242 4242" && amount > 0) {
        res.json({ status: 'success', message: 'Payment processed successfully!', amount, transactionId: Math.random().toString(36).substr(2, 9) });
    } else {
        res.status(400).json({ status: 'failure', message: 'Payment failed. Invalid card number or amount.' });
    }
};