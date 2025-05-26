import React, { useEffect } from "react";
import { CreateMedicineApi, Medicine, MedicinesApi } from "./api";

const medicineAPI = new MedicinesApi();
const createMedicineAPI = new CreateMedicineApi();

function App() {
  const [medicines, setMedicines] = React.useState<Medicine[]>([]);

  useEffect(() => {
    medicineAPI.medicinesList().then((res) => {
      setMedicines(res);
    });
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          createMedicineAPI.createMedicineCreate({
            medicine: {
              brand: "",
              expiryDate: new Date(),
              medicineId: 1,
              name: "",
              price: "",
              stockQuantity: 1,
              metaData: "",
            },
          });
        }}
      >
        add new medicine
      </button>
      <table>
        <thead>
          <tr>
            <th>Medicine Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Expiry Date</th>
            <th>Brand</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine) => (
            <tr key={medicine.medicineId}>
              <td>{medicine.medicineId}</td>
              <td>{medicine.name}</td>
              <td>{medicine.price}</td>
              <td>{medicine.stockQuantity}</td>
              <td>{medicine.expiryDate.toISOString()}</td>
              <td>{medicine.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
