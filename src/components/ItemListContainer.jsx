import React, { useEffect, useState } from "react";
import ItemList from './ItemList';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'
import { db } from "../firebase/firebase";
import { useAlert } from "../context/AlertContext";

const ItemListContainer = () => {
    const [loading, setLoading] = useState(false)
    const [productList, setProductList] = useState([])
    const { openAlert } = useAlert()


    useEffect(() => {
        const today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setMilliseconds(0);
        today.setSeconds(0);
        setLoading(true)
        const productos = query(collection(db, "pedido"), where ('client.date', '>=', today))
        getDocs(productos)
            .then((result) => {
                const lista = result.docs.map((product) => {
                    return {
                        id: product.id,
                        ...product.data().client
                    }
                })
                setProductList(lista)
            })
            .catch((error) => openAlert("error", error.message))
            .finally(() => setLoading(false))
        // eslint-disable-next-line
    }, [])

    return (
        <div className="my-lg-0 my-xl-3">
            {loading ? <p className="text-warning p-5">Cargando...</p> :
                <>
                    {
                            <ItemList productList={productList} className={'row m-lg-0 m-1'} />
                    }
                </>
            }
        </div>
    )
}

export default ItemListContainer