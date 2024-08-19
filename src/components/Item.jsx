import React from "react";
import { useAlert } from '../context/AlertContext'
import { doc,deleteDoc } from 'firebase/firestore'
import { useState } from 'react'
import { db } from '../firebase/firebase'

const Item = ({ producto}) => {
    const [loader, setLoader] = useState(false)
    const { openAlert } = useAlert()

    const removeItem = () => {
        setLoader(true)
        console.log(producto.id);
        const reference = doc(db, 'pedido', producto.id)
        deleteDoc(reference)
            .then((result) => {
                console.log(result);
                openAlert("success", "Eliminación exitosa!")
                window.location.reload(false);
            })
            .catch((error) => openAlert("error", error.message))
            .finally(() => setLoader(false))
    }

    return (
        <div className="col-12 row">
            <div className="col-md-10 col-lg-10 text-justify" style={{ fontSize: '14px' }}>
                <p>*<b>{producto.product}</b>* <br></br>
                    🖇️Nombre y apellido: {producto.name}<br></br>
                    🖇️DNI: {producto.dni}<br></br>
                    🖇️Celular: {producto.phone}<br></br>
                    🖇️Destino: {producto.to}<br></br>
                    🚛 Agencia: {producto.agency}<br></br>
                    -----------------
                </p>

            </div>
            <div className="col-md-2 col-lg-2" >
                <button className='btn btn-danger col-auto text-right' onClick={() => removeItem()} >X</button>
            </div>
          
        </div>
    );
};
export default Item;
