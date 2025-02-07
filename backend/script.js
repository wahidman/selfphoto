let selectedPackage = '';
let totalPrice = 0;

function buy(packageName, price) {
    selectedPackage = packageName;
    totalPrice = price;
    document.getElementById('selectedPackage').innerText = `Paket: ${selectedPackage}`;
    document.getElementById('totalPrice').innerText = `Total: Rp ${totalPrice.toLocaleString()}`;
    document.getElementById('paymentModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('paymentModal').style.display = 'none';
}

async function proceedToPayment() {
    closeModal();

    // Kirim permintaan ke backend untuk mendapatkan transaction_token
    try {
        let response = await fetch('http://localhost:3000/create-transaction', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                package: selectedPackage,
                amount: totalPrice
            })
        });

        let result = await response.json();

        if (result.transaction_token) {
            snap.pay(result.transaction_token, {
                onSuccess: function(result) {
                    alert('Pembayaran berhasil!');
                    console.log(result);
                },
                onPending: function(result) {
                    alert('Menunggu pembayaran...');
                    console.log(result);
                },
                onError: function(result) {
                    alert('Pembayaran gagal!');
                    console.log(result);
                },
                onClose: function() {
                    alert('Anda menutup popup pembayaran tanpa menyelesaikan transaksi.');
                }
            });
        } else {
            alert('Gagal mendapatkan token pembayaran.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat memproses pembayaran.');
    }
}
