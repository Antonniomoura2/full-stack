import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Box, Typography, Container,
  Checkbox, FormControlLabel, Grid, CircularProgress
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import apiService from '../services/api.service';
import { IOrder, IOrderInitialValues } from '@/types/orders';
import { Product } from '@/types/product.types';

const OrderForm: React.FC = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { id } = router.query;

  useEffect(() => {
    apiService.get('/products').then((response) => setProducts(response.data));
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiService.get<IOrder>(`/orders/${id}`).then((response) => {
        setOrder(response.data);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (values: IOrderInitialValues) => {
    try {
      const payload = {
        ...values,
        date: values.date || new Date().toISOString(),
        total: calculateTotal(values.productIds as unknown as { _id: string; quantity: number }[]),
      };
      if (id) {
        await apiService.put(`/orders/${id}`, payload);
        alert('Order updated successfully');
      } else {
        await apiService.post('/orders', payload);
        alert('Order created successfully');
      }
      router.push('/orders');
    } catch (error) {
      console.error('Erro ao salvar pedido', error);
    }
  };

  const calculateTotal = (items: { _id: string; quantity: number }[]) => {
    return items.reduce((sum, item) => {
      const product = products.find((p) => p._id === item._id);
      return sum + (product?.price || 0) * item.quantity;
    }, 0);
  };

  const validationSchema = Yup.object({
    productIds: Yup.array().of(
      Yup.object().shape({
        _id: Yup.string().required(),
        quantity: Yup.number().required().min(1),
      })
    ).min(1, 'Selecione pelo menos um produto'),
  });

  const initialProductIds = order
    ? (order.productIds as Product[]).map((p) => ({
        _id: typeof p === 'string' ? p : p._id,
        quantity: (p as unknown as {quantity: number}).quantity || 1,
      }))
    : [];

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        {id ? (order ? `Editar Pedido ${order._id}` : 'Carregando...') : 'Criar Novo Pedido'}
      </Typography>

      {!loading ? (
        <Formik
          initialValues={{
            productIds: initialProductIds,
            date: order?.date || new Date().toISOString(),
            total: order?.total || 0,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => {
            const handleCheck = (productId: string, checked: boolean) => {
              const updated = checked
                ? [...values.productIds, { _id: productId, quantity: 1 }]
                : values.productIds.filter((p) => p._id !== productId);
              setFieldValue('productIds', updated);
              setFieldValue('total', calculateTotal(updated as unknown as { _id: string; quantity: number }[]));
            };

            const handleQuantityChange = (productId: string, qty: number) => {
              const updated = values.productIds.map((item) =>
                item._id === productId ? { ...item, quantity: qty } : item
              );
              setFieldValue('productIds', updated);
              setFieldValue('total', calculateTotal(updated));
            };

            return (
              <Form>
                <Box>
                  <Typography variant="h6" gutterBottom>Produtos:</Typography>
                  <Grid container spacing={2}>
                    {products.map((product) => {
                      const isSelected = values.productIds.some((p) => p._id === product._id);
                      const selectedItem = values.productIds.find((p) => p._id === product._id);
                      return (
                        <Grid item xs={12} md={6} key={product._id}>
                          <Box border={1} borderRadius={2} padding={2}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={isSelected}
                                  onChange={(e) => handleCheck(product._id, e.target.checked)}
                                />
                              }
                              label={
                                <Box>
                                  <Typography variant="body1">{product.name}</Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    R$ {product.price.toFixed(2)}
                                  </Typography>
                                </Box>
                              }
                            />
                            {isSelected && (
                              <TextField
                                label="Quantidade"
                                type="number"
                                size="small"
                                margin="normal"
                                fullWidth
                                value={selectedItem?.quantity || 1}
                                onChange={(e) =>
                                  handleQuantityChange(product._id, parseInt(e.target.value) || 1)
                                }
                                inputProps={{ min: 1 }}
                              />
                            )}
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>

                  <Box mt={3}>
                    <TextField
                      label="Total"
                      name="total"
                      type="number"
                      value={values.total.toFixed(2)}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>

                  <Box mt={3}>
                    <Button variant="contained" type="submit">
                      {id ? 'Atualizar Pedido' : 'Criar Pedido'}
                    </Button>
                    <Button
                      variant="outlined"
                      sx={{ ml: 2 }}
                      onClick={() => router.push('/orders')}
                    >
                      Voltar
                    </Button>
                  </Box>
                </Box>
              </Form>
            );
          }}
        </Formik>
      ) : (
        <Box mt={4}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
};

export default OrderForm;
