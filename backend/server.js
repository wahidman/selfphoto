const express = require('express');
const midtransClient = require('midtrans-client');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

let snap = new midtransClient.Snap({
    isProduction: false, 
    serverKey: 'SB-Mid-server-3NWXj6H0uj0Zs_sWlyyENAQj'
});

app.post('/create-transaction', async (req, res) => {
    try {
        let parameter = {
            transaction_details: {
                order_id: "ORDER-" + new Date().getTime(),
                gross_amount: req.body.amount,
            },
            item_details: [
                {
                    id: "1",
                    price: req.body.amount,
                    quantity: 1,
                    name: req.body.package
                }
            ]
        };

        const transaction = await snap.createTransaction(parameter);
        res.json({ transaction_token: transaction.token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Terjadi kesalahan." });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
