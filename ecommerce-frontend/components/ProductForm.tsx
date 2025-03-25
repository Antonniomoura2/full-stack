import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, Typography, Container, MenuItem, Select, InputLabel, FormControl, Chip, Checkbox, ListItemText } from '@mui/material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import apiService from '../services/api.service';
import { IProductInitialValue, NewProduct } from '../src/types/product.types';
import { ICategory } from '@/types/category';

const ProductForm: React.FC = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [product, setProduct] = useState<NewProduct | null>(null);
    const router = useRouter();
    const { id } = router.query
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        apiService.get('/categories').then((response) => {
            setCategories(response.data);
        });
    }, []);

    useEffect(() => {
        if (id) {
            setLoading(true)
            try {
                apiService.get<NewProduct>(`/products/${id}`).then((response) => {
                    setProduct(response.data);
                    setLoading(false)
                });
            } catch (e) {
                console.log(e)
                setLoading(false)
            }
        }
    }, [id]);

    const handleImageUpload = async (file: File, setFieldValue: ((...params: unknown[]) => void)) => {
    
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiService.post<{ imageUrl: string }>('/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setFieldValue('imageUrl', response.data.imageUrl);
        } catch (error) {
            console.error('Erro ao enviar imagem', error);
        }
    };

    const handleCreateProduct = async (values: NewProduct) => {
        try {
            await apiService.post('/products', values);
            alert('Product created successfully');
            router.push('/products');
        } catch (error) {
            console.error('Erro ao criar produto', error);
        }
    };

    const handleUpdateProduct = async (values: NewProduct) => {
        try {
            await apiService.put(`/products/${id}`, values);
            alert('Product updated successfully');
            router.push('/products');
        } catch (error) {
            console.error('Erro ao atualizar produto', error);
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Product description is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        categoryIds: Yup.array().min(1, 'At least one category is required').required('Category is required'),
        imageUrl: Yup.string().required('Image is required'),
    });

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {id ? 'Edit Product' : 'Create New Product'}
            </Typography>

            {!loading ? <Formik
                initialValues={{
                    name: product?.name || '',
                    description: product?.description || '',
                    price: product?.price || 0,
                    categoryIds: product?.categoryIds || [],
                    imageUrl: product?.imageUrl,
                } as IProductInitialValue}
                validationSchema={validationSchema}
                onSubmit={id ? handleUpdateProduct : handleCreateProduct}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        <Box sx={{ marginTop: 4 }}>
                            <Field
                                name="name"
                                as={TextField}
                                label="Product Name"
                                fullWidth
                                margin="normal"
                                error={Boolean(<ErrorMessage name="name" />)}
                                helperText={<ErrorMessage name="name" />}
                            />

                            <Field
                                name="description"
                                as={TextField}
                                label="Description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={4}
                                error={Boolean(<ErrorMessage name="description" />)}
                                helperText={<ErrorMessage name="description" />}
                            />

                            <Field
                                name="price"
                                as={TextField}
                                label="Price"
                                type="number"
                                fullWidth
                                margin="normal"
                                error={Boolean(<ErrorMessage name="price" />)}
                                helperText={<ErrorMessage name="price" />}
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Categories</InputLabel>
                                <Select
                                    name="categoryIds"
                                    multiple
                                    value={values.categoryIds}
                                    onChange={(e) => setFieldValue('categoryIds', e.target.value)}
                                    renderValue={(selected) => (
                                        <div>
                                            {selected.map((id) => {
                                                const category = categories.find((cat) => cat._id === id);
                                                return category ? <Chip key={id} label={category.name} /> : null;
                                            })}
                                        </div>
                                    )}
                                >
                                    {categories.map((category: ICategory) => {
                                        return <MenuItem key={category._id} value={category._id}>
                                            <Checkbox checked={values.categoryIds.indexOf(category._id) > -1} />
                                            <ListItemText primary={category.name} />
                                        </MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <input
                                type="file"
                                onChange={(e) => handleImageUpload(e.target.files![0], setFieldValue as unknown as (...params: unknown[]) => void)}
                            />
                            {values.imageUrl && (
                                <div>
                                    <img src={values.imageUrl} alt="Product Image" width={100} />
                                </div>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                type="submit"
                            >
                                {id ? 'Update Product' : 'Create Product'}
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ marginTop: 2, marginLeft: 2 }}
                                onClick={() => router.push('/products')}
                            >
                                Back to Products
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik> : null}
        </Container>
    );
};

export default ProductForm;
