import React, { useEffect, useState } from "react";
import SingleOrder from "./SingleOrder";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/orders/user`)
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar los pedidos.");
        return res.json();
      })
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-dark-4">Cargando pedidos...</p>;
  }

  if (error) {
    return <p className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="bg-yellow-100 text-yellow-800 p-4 rounded-t-xl text-custom-sm font-medium">
        Nota: Si tu pedido está "Pendiente", asegúrate de realizar el depósito a nuestra cuenta BCP (193-XXXX-XXXX) o Banco de la Nación, y escríbenos al WhatsApp adjuntando tu comprobante para procesarlo.
      </div>
      <div className="w-full overflow-x-auto">
        <div className="min-w-[770px]">
          {/* <!-- order item header --> */}
          {orders.length > 0 && (
            <div className="items-center justify-between py-4.5 px-7.5 hidden md:flex border-b border-gray-3">
              <div className="min-w-[111px]">
                <p className="text-custom-sm text-dark font-semibold">Orden</p>
              </div>
              <div className="min-w-[175px]">
                <p className="text-custom-sm text-dark font-semibold">Fecha</p>
              </div>

              <div className="min-w-[128px]">
                <p className="text-custom-sm text-dark font-semibold">Estado</p>
              </div>

              <div className="min-w-[213px]">
                <p className="text-custom-sm text-dark font-semibold">Productos</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark font-semibold">Total(S/.)</p>
              </div>

              <div className="min-w-[113px]">
                <p className="text-custom-sm text-dark font-semibold">Acción</p>
              </div>
            </div>
          )}
          
          {orders.length > 0 ? (
            orders.map((orderItem, key) => (
              <SingleOrder key={orderItem._id || key} orderItem={orderItem} smallView={false} />
            ))
          ) : (
            <p className="py-9.5 px-4 sm:px-7.5 xl:px-10 text-dark-4">
              Aún no tienes pedidos registrados.
            </p>
          )}
        </div>

        {/* Mobile View */}
        {orders.length > 0 &&
          orders.map((orderItem, key) => (
            <SingleOrder key={orderItem._id || key} orderItem={orderItem} smallView={true} />
          ))}
      </div>
    </>
  );
};

export default Orders;
