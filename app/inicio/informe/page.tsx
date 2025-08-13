'use client'
import React from 'react'
import './informe.css'
import {Compra1, Venta1} from '@prisma/client'
import { useEffect, useState } from 'react'
import axios from 'axios'

function Informe() {
  const [ventas, setVentas] = useState<Venta1[]>([])
  const [compras, setCompras] = useState<Compra1[]>([]) // Solo se obtiene, no se muestra
  const [costoInventario, setCostoInventario] = useState<number>(0)

  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>('')
  const [totalIngresos, setTotalIngresos] = useState<number>(0)
  const [totalEgresos, setTotalEgresos] = useState<number>(0)
  const [totalVentas, setTotalVentas] = useState<number>(0)

  // Obtener datos y calcular costo total inventario
  const fetchData = async () => {
    try {
      const resVentas = await axios.get('/api/ventas')
      const resCompras = await axios.get('/api/compras')

      if (resVentas?.data) setVentas(resVentas.data)
      if (resCompras?.data) {
        setCompras(resCompras.data)

        // Cálculo del costo total del inventario (suma de compras)
        const sumaTotal = resCompras.data.reduce(
          (total: number, compra: Compra1) => total + compra.Total,
          0
        )
        setCostoInventario(sumaTotal)
      }
    } catch (error) {
      console.error('Error al obtener datos:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Función común para calcular totales a partir de ventas filtradas
  const calcularTotalesDeVentas = (ventasFiltradas: Venta1[]) => {
    // Ingreso: suma de (precio_Venta - precio_Costo) * cantidad
    const ingreso = ventasFiltradas.reduce(
      (acc, v) => acc + (parseFloat(v.precio_Venta) - parseFloat(v.precio_Costo)) * v.cantidad,
      0
    )
    // Egreso: suma de precio_Costo * cantidad (costo recuperado por venta)
    const egreso = ventasFiltradas.reduce(
      (acc, v) => acc + parseFloat(v.precio_Costo) * v.cantidad,
      0
    )
    // Total bruto de ventas: suma de precio_Venta * cantidad
    const totalBruto = ventasFiltradas.reduce(
      (acc, v) => acc + parseFloat(v.precio_Venta) * v.cantidad,
      0
    )

    setTotalIngresos(ingreso)
    setTotalEgresos(egreso)
    setTotalVentas(totalBruto)
  }

const calcularPorDia = () => {
  if (!fechaSeleccionada) return;

  console.log('estamos calculando por dia');

  const fechaFiltro = new Date(fechaSeleccionada + 'T00:00:00');
  const año = fechaFiltro.getFullYear();
  const mes = fechaFiltro.getMonth();
  const dia = fechaFiltro.getDate();

  const ventasDelDia = ventas.filter((v) => {
    const fechaVenta = new Date(v.fecha);
    const coincide =
      fechaVenta.getFullYear() === año &&
      fechaVenta.getMonth() === mes &&
      fechaVenta.getDate() === dia;

    console.log(`Venta ID: ${v.id_Venta}, Fecha: ${fechaVenta.toISOString()}, Coincide: ${coincide}`);
    return coincide;
  });

  console.log("Ventas del día encontradas:", ventasDelDia.length);

  let ingreso = 0;
  let egreso = 0;
  let totalVenta = 0;

  ventasDelDia.forEach(v => {
    const pv = parseFloat(v.precio_Venta);
    const pc = parseFloat(v.precio_Costo);
    const cantidad = v.cantidad;

    ingreso += (pv - pc) * cantidad;
    egreso += pc * cantidad;
    totalVenta += pv * cantidad;
  });

  console.log("Ingreso:", ingreso);
  console.log("Egreso:", egreso);
  console.log("Total venta:", totalVenta);

  setTotalIngresos(ingreso);
  setTotalEgresos(egreso);
  setTotalVentas(totalVenta);
};







  const calcularPorMesYAño = () => {
    if (!fechaSeleccionada) return

    const fecha = new Date(fechaSeleccionada)
    const mes = fecha.getMonth()
    const año = fecha.getFullYear()

    const ventasMes = ventas.filter((v) => {
      const f = new Date(v.fecha)
      return f.getMonth() === mes && f.getFullYear() === año
    })

    calcularTotalesDeVentas(ventasMes)
  }

  return (
    <div>
      <div className="Contenedor_Calculo">
        <img className="img" src="/estado-de-resultados.png" alt="Picture " />
        <div className="neto">
          <label className="datos" htmlFor="">
            {' '}
            <strong>Total costo inventario</strong>{' '}
          </label>
          <br />
          <input className="datos_input" type="text" value={costoInventario.toFixed(2)} readOnly />
          <strong className='strong'>BS</strong>
        </div>

        <div className="Contenedor_Cal">
          <div className=" contenedor_data">
            <label className="datos" htmlFor="">
              {' '}
              <strong>Total ingreso venta de productos</strong>{' '}
            </label>{' '}
            <br />
            <input className="datos_input" type="text" value={totalIngresos.toFixed(2)} readOnly />
            <strong className='strong'>BS</strong>
            <br />
          </div>
          <div className=" contenedor_data">
            <label className="datos" htmlFor="">
              {' '}
              <strong>Total egreso Compra de productos</strong>{' '}
            </label>
            <br />
            <input className="datos_input" type="text" value={totalEgresos.toFixed(2)} readOnly />
            <strong className='strong'>BS</strong>
            <br />
          </div>
          <div className=" contenedor_data">
            <label className="datos" htmlFor="">
              {' '}
              <strong className='strong'>Total venta bruto</strong>{' '}
            </label>
            <br />
            <input className="datos_input" type="text" value={totalVentas.toFixed(2)} readOnly />
            <strong className='strong'>BS</strong>
            <br />
          </div>
        </div>

        <div className="formingresos">
          <form action="">
            <input
              type="date"
              className="datos_inputs"
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
            <button type="button" className="Calculo" onClick={calcularPorDia}>
              Calcular por Día
            </button>
            <button type="button" className="Calculo" onClick={calcularPorMesYAño}>
              Calcular por Mes y Año
            </button>
          </form>
        </div>
      </div>
      <div className="Contend_BBDD">
        <div className="BD_compras">
          <table className="table" style={{ border: 'solid gray 2px', padding: '5px' }}>
            <thead >
              <tr >
                <th className="thead" style={{ padding: '5px' }}>
                  Id Vta
                </th>
                <th className="thead" style={{ padding: '5px' }}>
                  Cantidad
                </th>
                <th className="thead" style={{ padding: '5px' }}>
                  Precio compra
                </th>
                <th className="thead" style={{ padding: '5px' }}>
                  Precio Venta
                </th>
                <th className="thead" style={{ padding: '5px' }}>
                  fecha
                </th>
                <th className="thead" style={{ padding: '5px' }}>
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="tbody">
              {ventas.map((venta: Venta1) => (
                <tr key={venta.id_Venta}>
                  <td className="td" style={{ padding: '5px' }}>
                    {venta.id_Venta}
                  </td>
                  <td className="td" style={{ padding: '5px' }}>
                    {venta.cantidad}
                  </td>
                  <td className="td" style={{ padding: '5px' }}>
                    {venta.precio_Costo}
                  </td>
                  <td className="td" style={{ padding: '5px' }}>
                    {venta.precio_Venta}
                  </td>
                  <td className="td" style={{ padding: '5px' }}>
                    {new Date(venta.fecha).toLocaleDateString()}
                  </td>
                  <td className="td" style={{ padding: '5px' }}>
                    {venta.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Informe