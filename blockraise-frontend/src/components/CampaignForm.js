
import React, { useState } from 'react';

const DonationForm = ({ onDonate }) => {
    const [amount, setAmount] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onDonate(amount);
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Donation Amount (ETH):
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                />
            </label>
            <button type="submit">Donate</button>
        </form>
    );
};

export default DonationForm;
