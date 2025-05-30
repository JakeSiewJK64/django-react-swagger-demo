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
  const [search, setSearch] = React.useState("");
  const { register, handleSubmit } =
    useForm<components["schemas"]["CreateMedicine"]>();
  const [medicines, setMedicines] = React.useState<
    components["schemas"]["Medicine"][]
  >([]);

  React.useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function fetchMedicines() {
    client
      .GET("/api/v1/medicines/get_medicines", {
        params: {
          query: {
            name: search,
          },
        },
      })
      .then((res) => setMedicines(res.data ?? []));
  }

  function handleFormSubmit(
    formValues: components["schemas"]["CreateMedicine"]
  ) {
    client
      .POST("/api/v1/medicines/create_medicine", { body: formValues })
      .then(() => {
        fetchMedicines();
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
      <div className="flex flex-row gap-1 text-nowrap">
        <input
          type="text"
          className="border rounded w-full my-1 p-1"
          placeholder="search for medicine"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => {
            client
              .GET("/api/v1/medicines/export_medicines_csv", {
                parseAs: "blob",
              })
              .then((res) => {
                if (!res.data) {
                  return;
                }

                const url = window.URL.createObjectURL(res.data);
                const link = document.createElement("a");

                link.href = url;
                link.setAttribute("download", "medicine_export.csv");

                document.body.appendChild(link);

                link.click();
                link.remove();

                URL.revokeObjectURL(url);
              });
          }}
          className="border rounded my-1 px-1"
        >
          Export data
        </button>
      </div>
      <table className="border w-full">
        <thead className="border">
          <tr>
            <th>Medicine Id</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock Quantity</th>
            <th>Expiry Date</th>
            <th>Brand</th>
            <th></th>
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
              <td>
                <button
                  title={`Delete medicine id ${medicine.medicine_id}`}
                  className="border border-red-600 p-1 rounded m-1 text-red-600 cursor-pointer"
                  onClick={() => {
                    client
                      .DELETE("/api/v1/medicines/delete_medicine/{id}", {
                        params: {
                          path: {
                            id: medicine.medicine_id,
                          },
                        },
                      })
                      .then(() => fetchMedicines());
                  }}
                >
                  Delete medicine
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
