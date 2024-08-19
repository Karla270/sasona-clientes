import { Button, Chip, Divider, ButtonGroup, Box } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ItemCount from './ItemCount';
import RawHTML from './RawHTML';
import logo from '../assets/logo.png';


const ItemDetail = ({ item }) => {
    const { name, description, category, price, stock, image, id } = item
    const [count, setCount] = useState(1)
    const [compra, setCompra] = useState(false)
    const { addItem } = useCart()
    const navegar = useNavigate()


    const onAdd = () => {
        let purchase = {
            id,
            name,
            description,
            category,
            price,
            stock,
            image,
            quantity: count
        }
        setCompra(true)
        addItem(purchase, count)
    }


    return (
        <div className="col-12 row center-content m-lg-0 m-0">
            <div className='col-md-3 carta-logo d-none d-lg-flex'>
                <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="col-md-12 col-lg-9 m-md-2 m-lg-0">
                <div className="body">
                    <div className="card height-promocion text-center animate__animated animate__backInDown">
                        <h2><u>{name}</u></h2>
                        <div className="row">
                            <div className="col-sm-6">
                                <img src={require(`../assets/products/${image}`)} alt="Logo" className="item-img" />
                            </div>
                            <div className="col-sm-6 pt-3">
                                <RawHTML children={description} className={'item-description'} />
                                <h2 className='py-2'> <b>S/{price.toFixed(2)}</b></h2>
                                {!compra
                                    ? <ItemCount stock={stock} initial={1} onAdd={onAdd} count={count} setCount={setCount} />
                                    : <Box className='mt-3'>
                                        <ButtonGroup>
                                            <ButtonGroup>
                                                <Button variant="contained"
                                                    color="warning"
                                                    onClick={() => navegar('/')}
                                                >
                                                    Seguir Comprando
                                                </Button>
                                            </ButtonGroup>
                                            <Box className='mx-1'>
                                            </Box>
                                            <ButtonGroup>
                                                <Button variant="contained"
                                                    color="success"
                                                    onClick={() => navegar('/cart')}
                                                >
                                                    Ir al carrito
                                                </Button>
                                            </ButtonGroup>
                                        </ButtonGroup>
                                    </Box>
                                }
                            </div>
                        </div>

                        <Button variant="outlined" className='m-2' onClick={() => navegar(`/categoria/${category}`)}>Regresar</Button>
                        <Divider>
                            <Chip label="Stock" />
                        </Divider>
                        {stock > 0 ?
                            <p>Stock disponible: {stock}</p> :
                            <p className='text-danger'>No hay stock disponible</p>
                        }
                    </div>
                </div>
            </div>


        </div>

    )
}

export default ItemDetail

