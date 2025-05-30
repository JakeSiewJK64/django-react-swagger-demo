import React from "react";
import createClient from "openapi-fetch";
import { components, paths } from "./api/schema";
import { useForm } from "react-hook-form";

const authHeaders = new Headers();

authHeaders.append("Authentication", "MY_AUTH_TOKEN");

const client = createClient<paths>({
  baseUrl: "http://localhost:8000",
  headers: {
    ...authHeaders,
  },
});

function App() {
  const { register, handleSubmit } =
    useForm<components["schemas"]["CreateMedicine"]>();
  const [medicines, setMedicines] = React.useState<
    components["schemas"]["Medicine"][]
  >([]);

  React.useEffect(() => {
    client.GET("/api/v1/medicines").then(async (res) => {
      setMedicines(res.data ?? []);
    });
  }, []);

  function handleFormSubmit(
    formValues: components["schemas"]["CreateMedicine"]
  ) {
    client.POST("/api/v1/create_medicine", { body: formValues }).then((res) => {
      console.log(res);
    });
  }

  return (
    <div className="m-2">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="border p-2 rounded flex flex-row flex-wrap"
      >
        <input
          {...register("name")}
          className="border rounded p-1 m-1"
          type="text"
          placeholder="Name"
        />
        <input
          {...register("brand")}
          className="border rounded p-1 m-1"
          type="text"
          placeholder="Brand"
        />
        <input
          {...register("price")}
          className="border rounded p-1 m-1"
          type="text"
          placeholder="Price"
        />
        <input
          {...register("stock_quantity")}
          className="border rounded p-1 m-1"
          type="number"
          placeholder="Stock quantity"
        />
        <input
          {...register("expiry_date")}
          className="border rounded p-1 m-1"
          type="date"
          placeholder="Expiry date"
        />
        <button
          type="submit"
          className="border rounded p-1 hover:bg-slate-300 cursor-pointer"
        >
          add new medicine
        </button>
      </form>
      <table className="border my-2 w-full">
        <thead className="border">
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
            <tr className="text-center" key={medicine.medicine_id}>
              <td>{medicine.medicine_id}</td>
              <td>{medicine.name}</td>
              <td>{medicine.price}</td>
              <td>{medicine.stock_quantity}</td>
              <td>{medicine.expiry_date}</td>
              <td>{medicine.brand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
