import { addDoc, collection, doc, serverTimestamp, writeBatch, where, query, getDocs } from 'firebase/firestore'
import React from 'react'
import { useState, useRef } from 'react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import { db, } from '../firebase/firebase'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAlert } from '../context/AlertContext'
import ItemListContainer from './ItemListContainer';

const Checkout = () => {
    const [orderId, setOrderId] = useState('')
    const [loader, setLoader] = useState(false)
    const { cart, cartTotal, clear, user } = useCart()
    const { openAlert } = useAlert()
    const formikRef = useRef();

    const navigate = useNavigate()

    const checkSchema = Yup.object().shape({
        name: Yup.string()
            .min(3, "Nombre debe tener 3 caracteres como mínimo")
            .required("Nombre es requerido"),
        phone: Yup.string()
            .min(9, "Teléfono debe tener 9 dígitos como mínimo")
            .max(9, "Teléfono debe tener 9 dígitos como máximo")
            .required("Teléfono es requerido"),
        dni: Yup.string()
            .min(3, "DNI debe tener 3 caracteres como mínimo")
            .required("DNI es requerido"),
        to: Yup.string()
            .min(3, "Destino debe tener 3 caracteres como mínimo")
            .required("Destino es requerido"),
        agency: Yup.string()
            .min(3, "Agencia debe tener 3 caracteres como mínimo")
            .required("Agencia es requerido"),
        product: Yup.string()
            .min(3, "Pedido debe tener 3 caracteres como mínimo")
            .required("Pedido es requerido"),
    });

    const finalizarCompra = (client) => {
        setLoader(true)
        client.date = serverTimestamp()
        const ventas = collection(db, "pedido")
        addDoc(ventas, {
            client
        })
            .then(async (res) => {
                client.phone = client.phone.toString();
                if (orderId == null) addCliente(client);
                //await updateOrder(res)
                openAlert("success", "Registro exitoso!")
            })
            .catch((error) => openAlert("error", error.message))
            .finally(() => setLoader(false))
    }

    const phoneSearch = (txt) => {
        const phone = txt.target.value;
        formikRef.current.setFieldValue("phone", phone.trim());
        if (phone.length == 9) {
            setOrderId(null)
            const productos = query(collection(db, "cliente"), where('client.phone', '==', phone))
            getDocs(productos)
                .then((result) => {
                    const lista = result.docs.map((product) => {
                        return {
                            id: product.id,
                            ...product.data().client
                        }
                    })
                    if (lista.length == 0) {
                        openAlert("warning", "Celular no registrado");
                        formikRef.current.setFieldValue("agency", "");
                        formikRef.current.setFieldValue("dni", "");
                        formikRef.current.setFieldValue("name", "");
                        formikRef.current.setFieldValue("product", "");
                        formikRef.current.setFieldValue("to", "");
                    }
                    else {
                        formikRef.current.setFieldValue("agency", lista[0].agency);
                        formikRef.current.setFieldValue("dni", lista[0].dni);
                        formikRef.current.setFieldValue("name", lista[0].name);
                        formikRef.current.setFieldValue("product", lista[0].product);
                        formikRef.current.setFieldValue("to", lista[0].to);
                        setOrderId(lista[0].id)
                    }
                })
                .catch((error) => openAlert("error", error.message))
        }

    }

    const addCliente = (client) => {
        setLoader(true)
        client.date = serverTimestamp()
        const clientes = collection(db, "cliente")
        addDoc(clientes, {
            client
        })
            .then(async (res) => {
                //await updateOrder(res)
                openAlert("success", "Cliente registrado exitosamente!")
            })
            .catch((error) => openAlert("error", error.message))
            .finally(() => setLoader(false))
    }

    if (loader) {
        return <p className="text-warning p-5">Cargando...</p>
    }
    return (
        <div className='pt-md-5 pt-lg-0'>
            <div className="col-12 row center-content">
                <div className="col-md-12 col-lg-6 card body animate__animated animate__backInDown m-lg-0 m-2 mb-lg-3 mt-lg-5">
                    <Formik innerRef={formikRef}
                        initialValues={{ product: "", name: "", phone: "", dni: "", to: "", agency: "" }}
                        validationSchema={checkSchema}
                        onSubmit={(values) => {
                            finalizarCompra(values)
                        }}>
                        {({ touched, errors }) => (
                            <div>
                                <h2 className="text-center tittle-card"><u><b>PEDIDO</b></u></h2>
                                <Form className="col-auto pt-2" style={{ fontSize: '15px' }}>
                                    <div className="form-group">
                                        <label htmlFor="phone">Celular</label>
                                        <Field
                                            id="phone"
                                            type="number"
                                            name="phone"
                                            placeholder="Ej. 910719636"
                                            autoComplete="off"
                                            onKeyUp={e => {
                                                //setFieldTouched('type');
                                                phoneSearch(e)
                                            }}
                                            className={`form-control
                                                ${touched.phone && errors.phone ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="phone"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="product">Pedido</label>
                                        <Field
                                            id="product"
                                            type="text"
                                            name="product"
                                            placeholder="Ej. 5KG HARINA"
                                            autoComplete="off"
                                            className={`form-control
                                                ${touched.product && errors.product ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="product"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="name">Nombre completos</label>
                                        <Field
                                            id="name"
                                            type="text"
                                            name="name"
                                            placeholder="Ej. Karla Gonzales"
                                            autoComplete="off"
                                            className={`form-control
                                                ${touched.name && errors.name ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="name"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="dni">DNI</label>
                                        <Field
                                            id="dni"
                                            type="text"
                                            name="dni"
                                            placeholder="Ej. 71860627"
                                            autoComplete="off"
                                            className={`form-control
                                                ${touched.dni && errors.dni ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="dni"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="to">Destino</label>
                                        <Field
                                            id="to"
                                            type="text"
                                            name="to"
                                            placeholder="Ej. Piura (Of. Castilla)"
                                            autoComplete="off"
                                            className={`form-control
                                                ${touched.to && errors.to ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="to"
                                            className="invalid-feedback"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="agency">Agencia</label>
                                        <Field
                                            id="agency"
                                            type="text"
                                            name="agency"
                                            placeholder="Ej. Shalom"
                                            autoComplete="off"
                                            className={`form-control
                                                ${touched.agency && errors.agency ? "is-invalid" : ""}`}
                                        />

                                        <ErrorMessage
                                            component="div"
                                            name="agency"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="col-auto text-center m-auto">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-block mt-2"
                                        >
                                            AGREGAR
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        )}
                    </Formik>
                </div>
                <div className='col-md-6 d-none d-lg-flex card body animate__animated animate__backInDown m-lg-0 m-2 mb-lg-3 mt-lg-5'>
                    <h2 className="text-center tittle-card"><u><b>LISTA DE PEDIDOS</b></u></h2>
                    <h5 className='text-justify'>📌ENVÍOS PROVINCIA + TOMAR FOTO</h5>
                    <ItemListContainer />
                </div>
            </div>
        </div>
    )
}

export default Checkout