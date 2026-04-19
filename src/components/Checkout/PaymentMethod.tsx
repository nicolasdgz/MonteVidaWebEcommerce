"use client";
import React, { useState } from "react";
import Image from "next/image";

type PaymentMethodProps = {
  payment: string;
  setPayment: (val: string) => void;
};

const PaymentMethod: React.FC<PaymentMethodProps> = ({ payment, setPayment }) => {
  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
        <h3 className="font-medium text-xl text-dark">Método de Pago</h3>
      </div>

      <div className="p-4 sm:p-8.5">
        <div className="flex flex-col gap-3">
          {/* Transferencia */}
          <label htmlFor="transferencia" className="flex cursor-pointer select-none items-center gap-4">
            <div className="relative">
              <input
                type="radio"
                name="paymentMethod"
                id="transferencia"
                className="sr-only"
                checked={true}
                readOnly
              />
              <div
                className="flex h-4 w-4 items-center justify-center rounded-full border-4 border-blue"
              ></div>
            </div>
            <div
              className="rounded-md border-[0.5px] py-3.5 px-5 ease-out duration-200 border-transparent bg-gray-2 w-full"
            >
              <div className="flex items-center">
                <div className="pr-2.5">
                  <Image src="/images/checkout/bank.svg" alt="bank" width={29} height={12} />
                </div>
                <div className="border-l border-gray-4 pl-2.5">
                  <p>Depósito BCP / Banco de la Nación</p>
                </div>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
