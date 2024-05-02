
import React, { useState } from "react";
import Swal from "sweetalert2";
import { API_URL } from "../constants";

const DonationForm = ({ id }) => {
  const [amount, setAmount] = useState("");

  const donate = async () => {
    try {
      Swal.fire({
        title: "Please wait...",
        html: "Donation in progress",
        allowOutsideClick: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
        showConfirmButton: false, 
      });
      const response = await fetch(
        `${API_URL}/campaign/${id}/donate`, 
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount }), 
        }
      );
      console.log(response, "Response");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      Swal.fire({
        icon: "success",
        title: "Donation successful!",
        text: "Thank you for your donation.",
      });
    } catch (e) {
      console.log(e);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await donate(); // Call donate function
  };

  return (
    <>
      <h3>Send us Donation</h3>
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
    </>
  );
};

export default DonationForm;
