import React, {useState, useContext, useEffect} from "react"
import _ from "lodash"
import PropTypes from "prop-types"
import {Autocomplete, FormHelperText, Grid,
    List, TextField, Typography, Tooltip, IconButton
}from "@mui/material"
import {NumericFormat} from "react-number-format"
import DeleteOutlined from '@mui/icons-material/DeleteOutlined'

import MainCard from 'components/MainCard'
import ProductApi from "../../api/ProductApi"
import { ACTIONS, AppointmentContext } from "../../context/AppointmentContext"

const ProductWidget = ({ formik, touched, errors }) => {
    const { dispatch } = useContext(AppointmentContext)
    const { appointment } = useContext(AppointmentContext)
    const [inputProductValue, setInputProductValue] = useState('')
    const [productOptions, setProductOptions] = useState([])
    const [selectedProducts, setSelectedProducts] = useState([])

    useEffect(() => {
        if (appointment && appointment.products.length > 0) {
            setSelectedProducts(appointment.products)
        }

    }, [])

    const fetchProductOptions = async (value) => {
        try {
            const productOptionList = []
            const result = await ProductApi.search({keyword: value}, {}, 0, 10)
            if (result && result.data) {
                _.forEach(result.data, product => {
                    const option = {
                        name: product.name,
                        label: product.name,
                        productId: product.id.toString(),
                        msrp: product.msrp
                    }
                    productOptionList.push(option)
                })
            }
            setProductOptions(productOptionList)
        } catch (error) {
            console.error('Error fetching autocomplete options:', error)
        }
    }
    const handleProductSearch = (event, newValue) => {
        setInputProductValue(newValue)
        fetchProductOptions(newValue)
    }

    const handleSelectProduct = (value) => {
        const existing = selectedProducts.find((item) => item.productId === value.productId)
        if (!existing) {
            setSelectedProducts(prevItems => [...prevItems, value])
            dispatch({ type: ACTIONS.ADDPRODUCT, product: value })
        }
        setInputProductValue('')
    }

    const handleDeleteProduct = (productId) => {
        const products = selectedProducts.filter((product) => product.productId !== productId)
        setSelectedProducts(products)
        dispatch({ type: ACTIONS.REMOVEPRODUCT, productId: productId })
    }

    return (
        <>
        <Grid item xs={12}>
            <Autocomplete
                value={inputProductValue || null}
                onChange={(event, value, reason) => {
                    if (reason !== 'clear') {
                        handleSelectProduct(value)
                    }
                }}
                inputValue={inputProductValue}
                onInputChange={handleProductSearch}
                options={productOptions}
                isOptionEqualToValue={(option) => option.userId === formik.values.productId}
                renderOption={(props, option) => (
                    <li {...props} key={option.productId}>
                        {option.label}
                    </li>
                )}
                renderInput={(params) => <TextField {...params} label="Product Search" variant="outlined" />}
            />
            {touched.productId && errors.productId && <FormHelperText error={true}>{errors.productId}</FormHelperText>}
        </Grid>
        {(selectedProducts.length > 0) &&
            <Grid item xs={12}  sx={{ height: '40%' }}>
                <List>
                    {selectedProducts.map((product) => (
                        <MainCard key={'product' + product.productId}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={11}>
                                    <Grid item xs={12}>
                                        <Typography variant="h6">
                                            {product.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography color="body2">
                                            <NumericFormat value={product.msrp} displayType="text" thousandSeparator prefix="$" />
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                    <Grid item xs={12}>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                color="error"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteProduct(product.productId)
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </MainCard>
                    ))}
                </List>
            </Grid>
        }
        </>
    )
}

ProductWidget.propTypes = {
    formik: PropTypes.object,
    touched: PropTypes.object,
    errors: PropTypes.object
}
export default ProductWidget