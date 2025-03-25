import React, { useState, useEffect } from 'react';
import {
  Button,
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import apiService from '../services/api.service';
import { useRouter } from 'next/router';
import { IOrder } from '@/types/orders';

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const router = useRouter();

  useEffect(() => {
    apiService.get<IOrder[]>('/orders').then((response) => setOrders(response.data));
  }, []);

  const handleDeleteOrder = async (id: string) => {
    try {
      await apiService.delete(`/orders/${id}`);
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } catch (error) {
      console.error('Erro ao deletar pedido', error);
    }
  };

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        📦 Pedidos
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/orders/new')}
          >
            ➕ Criar Novo Pedido
          </Button>
        </Grid>

        {orders.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" sx={{ mt: 4 }}>
              Nenhum pedido cadastrado ainda.
            </Typography>
          </Grid>
        ) : (
          orders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">🧾 Pedido #{order._id.slice(-6)}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    📅 {new Date(order.date).toLocaleDateString('pt-BR')}
                  </Typography>

                  <Box mt={2}>
                    <Typography variant="subtitle1">Produtos:</Typography>
                    {order.productIds?.map((product) => {
                      const quantity = product.quantity || 1;
                      const subtotal = product.price * quantity;

                      return (
                        <Box key={product._id} sx={{ display: 'flex', mt: 2 }}>
                          <CardMedia
                            component="img"
                            image={product.imageUrl || 'https://via.placeholder.com/150'}
                            alt={product.name}
                            sx={{ width: 64, height: 64, borderRadius: 1, mr: 2 }}
                          />
                          <Box>
                            <Typography variant="body1">{product.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {quantity} × {formatCurrency(product.price)} ={' '}
                              <strong>{formatCurrency(subtotal)}</strong>
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>

                  <Box mt={2}>
                    <Typography variant="body1">
                      💰 <strong>Total:</strong> {formatCurrency(order.total)}
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => router.push(`/orders/edit/${order._id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteOrder(order._id)}
                  >
                    Excluir
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default OrdersList;
