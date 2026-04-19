import React, { useState } from "react";
import OrderActions from "./OrderActions";
import OrderModal from "./OrderModal";

const SingleOrder = ({ orderItem, smallView }: any) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const toggleModal = (status: boolean) => {
    setShowDetails(status);
    setShowEdit(status);
  };

  const formattedDate = new Date(orderItem.orderDate).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green bg-green-light-6";
      case "pending":
      case "on-hold":
        return "text-red bg-red-light-6";
      case "processing":
      case "paid":
        return "text-yellow bg-yellow-light-4";
      case "shipped":
        return "text-blue bg-blue-light-4";
      default:
        return "text-gray-600 bg-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    const map: any = {
      pending: "Pendiente",
      paid: "Pagado",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
    };
    return map[status] || status;
  };

  const productTitle = orderItem.items?.[0]?.productTitle 
    ? orderItem.items[0].productTitle + (orderItem.items.length > 1 ? " y más" : "")
    : "Sin Productos";

  return (
    <>
      {!smallView && (
        <div className="items-center justify-between border-t border-gray-3 py-5 px-7.5 hidden md:flex">
          <div className="min-w-[111px]">
            <p className="text-custom-sm text-red font-medium">
              #{orderItem.orderNumber?.slice(-8)}
            </p>
          </div>
          <div className="min-w-[175px]">
            <p className="text-custom-sm text-dark">{formattedDate}</p>
          </div>

          <div className="min-w-[128px]">
            <p
              className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] font-medium ${getStatusClasses(
                orderItem.status
              )}`}
            >
              {getStatusLabel(orderItem.status)}
            </p>
          </div>

          <div className="min-w-[213px]">
            <p className="text-custom-sm text-dark truncate pr-4" title={productTitle}>{productTitle}</p>
          </div>

          <div className="min-w-[113px]">
            <p className="text-custom-sm text-dark">S/. {orderItem.totalAmount?.toFixed(2)}</p>
          </div>

          <div className="flex gap-5 items-center">
            <OrderActions
              toggleDetails={toggleDetails}
              toggleEdit={toggleEdit}
            />
          </div>
        </div>
      )}

      {smallView && (
        <div className="block md:hidden border-t border-gray-3">
          <div className="py-4.5 px-7.5">
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Orden:</span> #
                {orderItem.orderNumber?.slice(-8)}
              </p>
            </div>
            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Fecha:</span>{" "}
                {formattedDate}
              </p>
            </div>

            <div className="my-1">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Estado:</span>{" "}
                <span
                  className={`inline-block text-custom-sm py-0.5 px-2.5 rounded-[30px] font-medium ${getStatusClasses(
                    orderItem.status
                  )}`}
                >
                  {getStatusLabel(orderItem.status)}
                </span>
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark line-clamp-1">
                <span className="font-bold pr-2">Productos:</span> {productTitle}
              </p>
            </div>

            <div className="">
              <p className="text-custom-sm text-dark">
                <span className="font-bold pr-2">Total:</span> S/. {orderItem.totalAmount?.toFixed(2)}
              </p>
            </div>

            <div className="mt-2">
              <p className="text-custom-sm text-dark flex items-center">
                <span className="font-bold pr-2">Acciones:</span>{" "}
                <OrderActions
                  toggleDetails={toggleDetails}
                  toggleEdit={toggleEdit}
                />
              </p>
            </div>
          </div>
        </div>
      )}

      {/* <OrderModal
        showDetails={showDetails}
        showEdit={showEdit}
        toggleModal={toggleModal}
        order={orderItem}
      /> */}
    </>
  );
};

export default SingleOrder;
