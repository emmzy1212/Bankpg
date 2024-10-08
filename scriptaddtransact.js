async function handleTransfer(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const amount = parseFloat(document.getElementById('transfer-amount').value).toFixed(2);
    const recipientName = document.getElementById('recipient-name').value;
    const recipientAccount = document.getElementById('recipient-account').value;
    const routingNumber = document.getElementById('routing-number').value;
    const bankName = document.getElementById('bank-name').value;
    const recipientEmail = document.getElementById('recipient-email').value;

    // Show SweetAlert with transfer details
    Swal.fire({
        title: 'Confirm Transfer',
        html: `<p>Amount: $${amount}</p>
               <p>Recipient: ${recipientName}</p>
               <p>Account Number: ${recipientAccount}</p>
               <p>Routing Number: ${routingNumber}</p>
               <p>Bank: ${bankName}</p>
               <p>Email: ${recipientEmail}</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Transfer',
        cancelButtonText: 'Cancel'
    }).then(async (result) => {
        if (result.isConfirmed) {
            // Send the transaction data to the backend
            try {
                
                const response = await fetch('https://bankbackend-nine.vercel.app/api/addtransaction', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        description: `Transfer to ${recipientName}`,
                        amount: -amount, // Amount is negative for withdrawals
                        status: 'Processing',
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // Display success alert
                    Swal.fire({
                        title: 'Transfer Initiated',
                        text: `Your transfer of $${amount} to ${recipientName} is being processed.`,
                        icon: 'info'
                    });

                    // Add the transaction to the transaction history with "Processing" status
                    const transactionHistoryTable = document.querySelector('.transaction-history tbody');
                    const currentDate = new Date().toLocaleDateString('en-US'); // Get current date

                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td>${currentDate}</td>
                        <td>Transfer to ${recipientName}</td>
                        <td>-$${amount}</td>
                        <td>Processing</td>
                    `;
                    transactionHistoryTable.appendChild(newRow);

                    // Optionally, clear the form fields after successful transfer
                    document.getElementById('transfer-form').reset();
                } else {
                    throw new Error(data.message || 'Error initiating transfer');
                }
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
                });
            }
        }
    });
}
